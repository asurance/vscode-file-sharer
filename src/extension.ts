import express from 'express'
import { commands, window, ViewColumn, Uri, env, OpenDialogOptions, workspace } from 'vscode'
import { resolve } from 'path'
import { readFile, existsSync } from 'fs'
import type { ExtensionContext, WebviewPanel, Disposable } from 'vscode'
import { Server } from 'http'
import { getIp } from './network'
import { AddressInfo } from 'net'

async function GetWebviewContent(context: ExtensionContext): Promise<string> {
    const publicPath = resolve(context.extensionPath, 'public')
    const htmlPath = resolve(publicPath, 'index.html')
    const htmlContent = await new Promise<string>((resolve, reject) => readFile(htmlPath, 'utf-8', (err, data) => {
        if (err) {
            reject(err)
        } else {
            resolve(data)
        }
    }))
    return htmlContent.replace(/(<script.+?src=")(.+?)"/g, (match, $1, $2) => {
        return `${$1}${Uri.file(resolve(publicPath, $2)).with({ scheme: 'vscode-resource' })}"`
    })
}

export function createUUID(): string {
    let dt = Date.now()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: string) {
        const r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}

export function activate(context: ExtensionContext): void {
    let curText = ''
    let panel: WebviewPanel | null = null
    const fileMap = new Map<string, string>()
    const webviewContent = GetWebviewContent(context)
    const app = express()
    app.use('/text', express.static(resolve(__dirname, '..', 'web')))
    let server: Server | null = null
    app.get('/file', (req, res) => {
        const uuid = req.url.slice(1)
        if (fileMap.has(uuid)) {
            const path = fileMap.get(uuid)!
            if (existsSync(path)) {
                res.sendFile(path)
                return
            }
        }
        res.status(404).send()
    })
    app.get('/text/syncText', (req, res) => {
        res.send(curText)
    })
    app.put('/text/syncText', (req, res) => {
        const text = req.body as string
        curText = text
        res.status(200).send()
        const message: OutMessage<'SyncText'> = {
            type: 'SyncText',
            data: curText
        }
        panel?.webview.postMessage(message)
    })
    const inMessageCBMap: { [T in keyof InMessageMap]: InMessageCB<T> } = {
        StartServer: () => {
            server?.close()
            server = app.listen(() => {
                const ip = getIp()
                const address = server!.address() as AddressInfo
                const url = `http://${ip}:${address.port}`
                const message: OutMessage<'StartServer'> = {
                    type: 'StartServer',
                    data: url
                }
                panel?.webview.postMessage(message)
            })
        },
        StopServer: () => {
            server?.close((err) => {
                if (err) {
                    window.showErrorMessage(err.message)
                } else {
                    const message: OutMessage<'StopServer'> = {
                        type: 'StopServer',
                    }
                    panel?.webview.postMessage(message)
                }
            })
        },
        SyncText: (text: string) => {
            curText = text
        },
        AddFile: async () => {
            const getShowDialogOption = async (): Promise<OpenDialogOptions | undefined> => {
                const option: OpenDialogOptions = { canSelectMany: false }
                if (workspace.workspaceFolders) {
                    if (workspace.workspaceFolders.length > 1) {
                        const pickList = workspace.workspaceFolders.map(f => f.uri.fsPath).concat('取消')
                        let result = await window.showQuickPick(pickList)
                        while (!result) {
                            result = await window.showQuickPick(pickList)
                        }
                        if (result === '取消') {
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
            const option = await getShowDialogOption()
            if (option) {
                const uris = await window.showOpenDialog(option)
                if (panel) {
                    if (uris && uris.length > 0) {
                        let uuid = createUUID()
                        while (fileMap.has(uuid)) {
                            uuid = createUUID()
                        }
                        const fsPath = uris[0].fsPath
                        fileMap.set(uuid, fsPath)
                        const message: OutMessage<'AddFile'> = {
                            type: 'AddFile',
                            data: {
                                fsPath,
                                url: uuid,
                            }
                        }
                        panel.webview.postMessage(message)
                        return
                    }
                }
            }
            const message: OutMessage<'AddFile'> = {
                type: 'AddFile',
                data: null
            }
            panel?.webview.postMessage(message)
        },
        RemoveFile: (fileUrl: string) => {
            fileMap.delete(fileUrl)
        },
        CopyFileUrl: (fileUrl: string) => {
            env.clipboard.writeText(fileUrl)
        },
    }
    context.subscriptions.push(commands.registerCommand('asurance.vscodeFileSharer', async () => {
        if (panel) {
            panel.reveal(ViewColumn.Beside)
        } else {
            panel = window.createWebviewPanel(
                'FileSharer',
                '文件分享',
                ViewColumn.Beside,
                {
                    enableScripts: true,
                    localResourceRoots: [Uri.file(resolve(context.extensionPath, 'public'))],
                    retainContextWhenHidden: true,
                }
            )
            const html = await webviewContent
            panel.webview.html = html
            const dispose: Disposable[] = []
            dispose.push(panel.onDidDispose(() => {
                panel = null
                dispose.forEach(d => d.dispose())
            }), panel.webview.onDidReceiveMessage(async (message) => {
                if (message.type in inMessageCBMap) {
                    inMessageCBMap[message.type as keyof InMessageMap](message.data)
                }
            }))
        }
    }))
}