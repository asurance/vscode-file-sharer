export function UploadFile(file: File, onProgress: (percent: number) => void): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const requeset = new XMLHttpRequest()
        requeset.open('PUT', 'upload')
        requeset.setRequestHeader('Content-Disposition', `filename="${file.name}"`)
        requeset.onprogress = (ev): void => {
            onProgress(Math.floor(ev.loaded / ev.total * 100))
        }
        requeset.onload = (): void => {
            resolve()
        }
        requeset.onerror = (): void => {
            reject(new Error('XMLHTTPRequeset Error!'))
        }
        requeset.send(file)
    })
}

export function MockUploadFile(file: File, onProgress: (percent: number) => void): Promise<void> {
    return new Promise<void>((resolve) => {
        let cur = 0
        const intervalId = setInterval(() => {
            cur = Math.min(cur + 10, 100)
            onProgress(cur)
        }, 1000)
        const timeoutId = setTimeout(() => {
            clearInterval(intervalId)
            clearTimeout(timeoutId)
            resolve()
        }, 10000)
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