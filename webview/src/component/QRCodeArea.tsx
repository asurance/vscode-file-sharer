import React from 'react'
import { QRCodeRenderersOptions, toCanvas } from 'qrcode'
import { Default } from '../config'

interface Props {
    text: string;
}

const DefaultRenderOption: QRCodeRenderersOptions = {
    width: 100,
}

export function QRCodeArea({
    text
}: Readonly<Props>): JSX.Element {
    return (<div>
        <canvas
            ref={(ref): Promise<void> | null =>
                ref && toCanvas(ref, text.length > 0 ? text : Default.QRCodeText, DefaultRenderOption)}
            width={100}
            height={100}
        />
    </div>)
}