import { Disposable, env, ExtensionContext, OpenDialogOptions, Uri, ViewColumn, WebviewPanel, window, workspace } from 'vscode'
import { createUUID, getIp, GetWebviewContent } from './util'
import express, { Express, Request, Response } from 'express'
import { Server } from 'http'
import { AddressInfo } from 'net'
import bodyParser from 'body-parser'
import { existsSync } from 'fs'

export class App {
    private curText = ''
    private panel: WebviewPanel | null = null
    private webviewContent: Promise<string>
    private app: Express
    private server: Server | null = null
    private fileMap = new Map<string, string>()

    constructor(private context: ExtensionContext) {
        this.webviewContent = GetWebviewContent(context.asAbsolutePath('public'))
        const app = express()
        app.use(bodyParser.text())
        app.use('/text', express.static(context.asAbsolutePath('web')))
        app.get('/file/:uuid', this.onGetFile)
        app.get('/text/syncText', this.onGetText)
        app.put('/text/syncText', this.onPutText)
        this.app = app
    }

    private onGetFile = (req: Request, res: Response): void => {
        const uuid = req.params.uuid
        if (this.fileMap.has(uuid)) {
            const path = this.fileMap.get(uuid)!
            if (existsSync(path)) {
                res.sendFile(path)
                return
            }
        }
        res.status(404).send()
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

    private StartServer = (): void => {
        this.server?.close()
        this.server = this.app.listen(() => {
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
        })
    }

    private StopServer = (): void => {
        this.fileMap.clear()
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
        if (workspace.workspaceFolders) {
            if (workspace.workspaceFolders.length > 1) {
                const pickList = workspace.workspaceFolders.map(f => f.uri.fsPath)
                const result = await window.showQuickPick(pickList)
                if (result === undefined) {
                    return
                } else {
                    option.defaultUri = Uri.file(result)
                }
            } else {
                option.defaultUri = workspace.workspaceFolders[0].uri
            }
        }
        return option
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

    active = async (): Promise<void> => {
        if (this.panel) {
            this.panel.reveal(ViewColumn.Beside)
        } else {
            this.panel = window.createWebviewPanel(
                'FileSharer',
                '文件分享',
                ViewColumn.Beside,
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
                this.fileMap.clear()
                dispose.forEach(d => d.dispose())
            }), this.panel.webview.onDidReceiveMessage(async (message) => {
                if (message.type in this) {
                    this[message.type as keyof InMessageMap](message.data)
                }
            }))
        }
    }
}