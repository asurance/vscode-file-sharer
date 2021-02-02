import { Disposable, env, ExtensionContext, OpenDialogOptions, Uri, ViewColumn, WebviewPanel, window, workspace } from 'vscode'
import { createUUID, getIp, GetWebviewContent } from './util'
import express, { Express, Request, Response } from 'express'
import { createServer, Server } from 'http'
import bodyParser from 'body-parser'
import { existsSync } from 'fs'
import { toFile } from 'qrcode'
import { AddressInfo } from 'net'
import { FileData } from './fileData'

export class App {
    private curText = ''
    private panel: WebviewPanel | null = null
    private webviewContent: Promise<string>
    private app: Express
    private server: Server | null = null
    private fileMap = new Map<string, string | FileData>()

    constructor(private context: ExtensionContext) {
        this.webviewContent = GetWebviewContent(context.asAbsolutePath('public'))
        const app = express()
        app.use(bodyParser.text())
        app.use('/text', express.static(context.asAbsolutePath('web')))
        app.get('/file/:uuid', this.onGetFile)
        app.get('/text/syncText', this.onGetText)
        app.put('/text/syncText', this.onPutText)
        app.put('/text/upload', this.onPutFile)
        this.app = app
    }

    private onGetFile = (req: Request, res: Response): void => {
        const uuid = req.params.uuid
        if (this.fileMap.has(uuid)) {
            const target = this.fileMap.get(uuid)!
            if (typeof target === 'string') {
                if (existsSync(target)) {
                    res.sendFile(target)
                    return
                }
            } else {
                res.setHeader('content-type', target.contentType)
                res.setHeader('content-disposition', `filename="${target.filename}"`)
                res.send(target.buffer)
                return
            }
        }
        res.status(404).send('File not found')
    }

    private onPutFile = (req: Request, res: Response): void => {
        if (!req.headers['content-length']) {
            res.sendStatus(411).send('Require content length')
            return
        }
        if (!req.headers['content-type']) {
            res.sendStatus(400).send('Require content type')
            return
        }
        if (!req.headers['content-disposition']) {
            res.sendStatus(400).send('Require content disposition')
            return
        }
        const matchResult = req.headers['content-disposition'].match(/filename="(.*)"/)
        if (!(matchResult?.[1]?.length)) {
            res.sendStatus(400).send('Content disposition format error')
            return
        }
        const file: FileData = {
            buffer: Buffer.allocUnsafe(parseInt(req.headers['content-length'])),
            contentType: req.headers['content-type'],
            filename: matchResult[1]
        }
        let offset = 0
        req.on('data', (chunk: Buffer) => {
            chunk.copy(file.buffer, offset)
            offset += chunk.length
        })
        req.on('end', () => {
            let uuid = createUUID()
            while (this.fileMap.has(uuid)) {
                uuid = createUUID()
            }
            this.fileMap.set(uuid, file)
            const message: OutMessage<'AddFile'> = {
                type: 'AddFile',
                data: {
                    fsPath: file.filename,
                    uuid,
                }
            }
            this.panel?.webview.postMessage(message)
            res.send()
        })
    }

    private onGetText = (req: Request, res: Response): void => {
        res.send(this.curText)
    }

    private onPutText = (req: Request, res: Response): void => {
        const text = req.body as string
        this.curText = text
        res.status(200).send()
        const message: OutMessage<'SyncText'> = {
            type: 'SyncText',
            data: this.curText
        }
        this.panel?.webview.postMessage(message)
    }

    private ShowError = (error: string): void => {
        window.showErrorMessage(error)
    }

    private StartServer = (port: number | null): void => {
        this.StopServer()
        this.server = createServer(this.app)
        this.server.on('error', (err: Error & { code: string }) => {
            if (err.code === 'EADDRINUSE') {
                window.showErrorMessage('该端口已被占用,请更换端口或置空以使用随机端口')
            } else {
                window.showErrorMessage(err.message)
            }
            const message: OutMessage<'StartServer'> = {
                type: 'StartServer',
                data: null
            }
            this.panel?.webview.postMessage(message)
            this.server!.close()
            this.server = null
        })
        if (port === null) {
            this.server.listen(this.onServerStart)
        } else {
            this.server.listen(port, '0.0.0.0', this.onServerStart)
        }
    }

    private onServerStart = (): void => {
        const ip = getIp()
        const port = (this.server!.address() as AddressInfo).port
        const message: OutMessage<'StartServer'> = {
            type: 'StartServer',
            data: {
                host: ip,
                port: `${port}`
            }
        }
        this.panel?.webview.postMessage(message)
    }

    private StopServer = (): void => {
        this.fileMap.clear()
        this.curText = ''
        if (this.server) {
            this.server.close()
            this.server = null
        }
    }

    private SyncText = (text: string): void => {
        this.curText = text
    }

    private async getShowDialogOption(): Promise<OpenDialogOptions | undefined> {
        const option: OpenDialogOptions = { canSelectMany: false }
        const defaultUri = await this.getDefaultUri()
        if (defaultUri) {
            option.defaultUri = defaultUri
            return option
        }
    }

    private async getDefaultUri(): Promise<Uri | undefined> {
        if (workspace.workspaceFolders) {
            if (workspace.workspaceFolders.length > 1) {
                const pickList = workspace.workspaceFolders.map(f => f.uri.fsPath)
                const result = await window.showQuickPick(pickList)
                if (result === undefined) {
                    return undefined
                } else {
                    return Uri.file(result)
                }
            } else {
                return workspace.workspaceFolders[0].uri
            }
        }
    }

    private AddFile = async (): Promise<void> => {
        const option = await this.getShowDialogOption()
        if (option) {
            const uris = await window.showOpenDialog(option)
            if (this.panel) {
                if (uris && uris.length > 0) {
                    let uuid = createUUID()
                    while (this.fileMap.has(uuid)) {
                        uuid = createUUID()
                    }
                    const fsPath = uris[0].fsPath
                    this.fileMap.set(uuid, fsPath)
                    const message: OutMessage<'AddFile'> = {
                        type: 'AddFile',
                        data: {
                            fsPath,
                            uuid,
                        }
                    }
                    this.panel.webview.postMessage(message)
                }
            }
        }
    }

    private RemoveFile = (uuid: string): void => {
        this.fileMap.delete(uuid)
    }

    private CopyFileUrl = (fileUrl: string): void => {
        env.clipboard.writeText(fileUrl)
    }

    private SaveQRCode = async (text: string): Promise<void> => {
        const defaultUri = await this.getDefaultUri()
        const targetUri = await window.showSaveDialog({ defaultUri, filters: { png: ['png'], svg: ['svg'] } })
        if (targetUri) {
            toFile(targetUri.fsPath, text, (err) => {
                if (err) {
                    window.showErrorMessage(err.message)
                }
            })
        }
    }

    active = async (): Promise<void> => {
        if (this.panel) {
            this.panel.reveal(ViewColumn.Active)
        } else {
            this.panel = window.createWebviewPanel(
                'FileSharer',
                '文件分享',
                ViewColumn.Active,
                {
                    enableScripts: true,
                    localResourceRoots: [Uri.file(this.context.asAbsolutePath('public'))],
                    retainContextWhenHidden: true,
                }
            )
            const html = await this.webviewContent
            this.panel.webview.html = html
            const dispose: Disposable[] = []
            dispose.push(this.panel.onDidDispose(() => {
                this.panel = null
                this.StopServer()
                dispose.forEach(d => d.dispose())
            }), this.panel.webview.onDidReceiveMessage(async (message) => {
                if (message.type in this) {
                    // @ts-expect-error ts暂时无法识别该语法
                    this[message.type as keyof InMessageMap](message.data)
                }
            }))
        }
    }
}