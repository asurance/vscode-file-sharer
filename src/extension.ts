import express from 'express'
import { commands, window, ViewColumn, Uri, workspace, env } from 'vscode'
import { resolve, basename } from 'path'
import { readFile, existsSync } from 'fs'
import { PromiseObject } from './promiseObject'
import { getIp, createServer } from './network'
import type { Express } from 'express'
import type { ExtensionContext, WebviewPanel, Disposable, OpenDialogOptions } from 'vscode'

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
    return htmlContent.replace(/(<script.+?src="|<link.+?href=")(.+?)"/g, (match, $1, $2) => {
        return `${$1}${Uri.file(resolve(publicPath, $2)).with({ scheme: 'vscode-resource' })}"`
    })
}

async function ParseWebviewContent(context: ExtensionContext, app: Express): Promise<string> {
    const content = await GetWebviewContent(context)
    const host = getIp()
    const port = await createServer(app)
    return content.replace(/<meta id="data" host=".*" port=".*"(.*)\/>/, (match, $1) => {
        return `<meta id="data" host="${host}" port="${port}" ${$1}/>`
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
    let panel: WebviewPanel | null = null
    const fileMap: { [key: string]: string } = {}
    const app = express()
    app.get('*', (req, res) => {
        const uuid = req.url.slice(1)
        if (uuid in fileMap) {
            const path = fileMap[uuid]
            if (existsSync(path)) {
                const fileName = basename(fileMap[uuid])
                // res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
                res.setHeader('Content-Disposition', `filename="${fileName}"`)
                res.sendFile(fileMap[uuid])
            } else {
                res.status(404).send()
            }
        } else {
            res.status(404).send()
        }
    })
    const webviewContent = new PromiseObject(ParseWebviewContent(context, app))
    const inMessageCBMap: { [T in keyof InMessageMap]: InMessageCB<T> } = {
        SelectFile: async () => {
            const option: OpenDialogOptions = workspace.workspaceFolders ? { defaultUri: workspace.workspaceFolders[0].uri } : {}
            const uri = await window.showOpenDialog(option)
            if (uri && uri.length > 0 && panel) {
                const message: OutMessage<'FileInfo'> = {
                    type: 'FileInfo',
                    data: uri.map(u => {
                        let uuid = createUUID()
                        while (uuid in fileMap) {
                            uuid = createUUID()
                        }
                        const name = u.fsPath
                        fileMap[uuid] = name
                        return {
                            name,
                            uuid,
                        }
                    })
                }
                panel.webview.postMessage(message)
            }
        },
        DeleteFile: (uuid: string) => {
            delete fileMap[uuid]
        },
        Copy: (content: string) => {
            env.clipboard.writeText(content)
        }
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
                    localResourceRoots: [Uri.file(resolve(context.extensionPath, 'public'))]
                }
            )
            const html = await webviewContent.getData()
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