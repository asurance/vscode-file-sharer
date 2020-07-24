function createUUID(): string {
    let dt = Date.now()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: string) {
        const r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}
window.acquireVsCodeApi = (): VSCode<State> => {
    return {
        getState(): undefined {
            return undefined
        },
        setState(): void {
            // none
        },
        postMessage(message): void {
            // none
            if (message.type === 'SelectFile') {
                window.postMessage({ type: 'FileInfo', data: [{ name: createUUID(), uuid: createUUID() }] }, '*')
            }
        }
    }
}
import('./index')