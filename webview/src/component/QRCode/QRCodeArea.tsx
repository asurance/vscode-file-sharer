import React from 'react'
import { toCanvas } from 'qrcode'
import { DefaultQRCodeText } from '../../config'
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
                ref && toCanvas(ref, text.length > 0 ? text : DefaultQRCodeText)}
            width={100}
            height={100}
        />
    </div>)
}