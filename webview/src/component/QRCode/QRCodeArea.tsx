import React, { memo } from 'react'
import { toCanvas } from 'qrcode'
import { root } from './QRCodeArea.css'
import { DefaultQRCodeText } from '../../config'

interface IProps {
    text: string;
}

export const QRCodeArea = memo(function QRCodeArea({
    text
}: Readonly<IProps>): JSX.Element {
    return (<div className={root}>
        <canvas
            ref={(ref): Promise<void> | null =>
                ref && toCanvas(ref, text || DefaultQRCodeText)}
        />
    </div>)
})