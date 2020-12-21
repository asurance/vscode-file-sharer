import { networkInterfaces } from 'os'
import { resolve } from 'path'
import { Uri } from 'vscode'
import { readFile } from 'fs'

export function getIp(): string {
    const interfaces = networkInterfaces()
    for (const name in interfaces) {
        const face = interfaces[name]
        if (face) {
            for (let i = 0; i < face.length; i++) {
                const alias = face[i]
                if (alias.family === 'IPv4' && !alias.internal) {
                    return alias.address
                }
            }
        }
    }
    return '0.0.0.0'
}

export async function GetWebviewContent(publicPath: string): Promise<string> {
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

export function createUUID(): string {
    let dt = Date.now()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: string) {
        const r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}