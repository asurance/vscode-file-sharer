import React from 'react'
import { toCanvas } from 'qrcode'
import { root } from './QRCodeArea.css'

interface Props {
    text: string;
}

export function QRCodeArea({
    text
}: Readonly<Props>): JSX.Element {
    return (<div className={root}>
        <canvas
            ref={(ref): Promise<void> | null =>
                ref && toCanvas(ref, text)}
            width={100}
            height={100}
        />
    </div>)
}