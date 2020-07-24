import React from 'react'
import { vscode } from './index'
import { Button } from './Button'

function onClick(): void {
    const message: OutMessage<'SelectFile'> = {
        type: 'SelectFile',
    }
    vscode.postMessage(message)
}

export function Extra(): JSX.Element {
    return (<div style={{ alignSelf: 'center' }}><Button onClick={onClick} content="+" /></div>)
}