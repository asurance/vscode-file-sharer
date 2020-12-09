function createUUID(): string {
    let dt = Date.now()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: string) {
        const r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}
window.acquireVsCodeApi = (): VSCode<Partial<State>> => {
    return {
        getState(): Partial<State> | undefined {
            const item = localStorage.getItem('state')
            if (item) {
                return JSON.parse(item)
            }
        },
        setState(state): void {
            localStorage.setItem('state', JSON.stringify(state))
        },
        postMessage(message): void {
            if (message.type === 'SelectFile') {
                window.postMessage({ type: 'FileInfo', data: [{ name: createUUID(), uuid: createUUID() }] }, '*')
            }
        }
    }
}
import('./index')