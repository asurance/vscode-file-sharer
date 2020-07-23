import React from 'react'
import { vscode } from './index'

function onClick(): void {
    const message: OutMessage<'SelectFile'> = {
        type: 'SelectFile',
    }
    vscode.postMessage(message)
}

export function Extra(): JSX.Element {
    return (<div><button onClick={onClick}>+</button></div>)
}