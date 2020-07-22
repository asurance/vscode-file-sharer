import { networkInterfaces } from 'os'
import { AddressInfo } from 'net'
import { Express } from 'express'

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

export function createServer(app: Express): Promise<number> {
    return new Promise<number>(resolve => {
        const server = app.listen(() => {
            const address = server.address() as AddressInfo
            resolve(address.port)
        })
    })
}