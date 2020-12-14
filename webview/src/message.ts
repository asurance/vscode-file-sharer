const messageMap: { [T in keyof InMessageMap]?: InMessageCB<T> } = {}

window.onmessage = (ev: MessageEvent): void => {
    if (ev.data.type in messageMap) {
        messageMap[ev.data.type as keyof InMessageMap]!(ev.data.data)
    }
}

export function SetCallback<T extends keyof InMessageMap>(eventname: T, callback: InMessageCB<T>): void {
    // @ts-expect-error
    messageMap[eventname] = callback
}

export function ClearCallback(eventname: keyof InMessageMap): void {
    delete messageMap[eventname]
}

export const PostMessage = acquireVsCodeApi().postMessage