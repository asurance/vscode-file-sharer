function createUUID(): string {
    let dt = Date.now()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: string) {
        const r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}

window.acquireVsCodeApi = (): VSCode => {
    return {
        postMessage(message): void {
            switch (message.type) {
                case 'StartServer':
                    setTimeout(() => {
                        window.postMessage({ type: 'StartServer', data: { host: location.host, port: location.port } }, '*')
                    }, 500)
                    break
                case 'StopServer':
                    setTimeout(() => {
                        window.postMessage({ type: 'StopServer' }, '*')
                    }, 500)
                    break
                case 'SyncText':
                    console.log('SyncText', (message as OutMessage<'SyncText'>).data)
                    break
                case 'AddFile':
                    window.postMessage({
                        type: 'AddFile', data: { fsPath: window.prompt('输入文件信息', '/root'), uuid: createUUID() }
                    }, '*')
                    break
                case 'CopyFileUrl':
                    navigator.clipboard.writeText((message as OutMessage<'CopyFileUrl'>).data)
                    break
                case 'SaveQRCode':
                    console.log('SaveQRCode', (message as OutMessage<'SaveQRCode'>).data)
                    break
            }
        }
    }
}
interface Window {
    sync: (text: string) => void;

}
window.sync = (text): void => {
    window.postMessage({ type: 'SyncText', data: text }, '*')
}
import('./index')