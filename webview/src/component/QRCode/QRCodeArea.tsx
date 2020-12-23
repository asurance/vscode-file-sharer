import React, { memo, useCallback } from 'react'
import { toCanvas } from 'qrcode'
import { root } from './QRCodeArea.css'
import { DefaultQRCodeText } from '../../config'
import { PostMessage } from '../../message'

interface IProps {
    text: string;
}

export const QRCodeArea = memo(function QRCodeArea({
    text
}: Readonly<IProps>): JSX.Element {
    const onClickSave = useCallback(() => {
        PostMessage({ type: 'SaveQRCode', data: text })
    }, [text])
    return (<div className={root}>
        <canvas
            ref={(ref): Promise<void> | null =>
                ref && toCanvas(ref, text || DefaultQRCodeText)}
        />
        <button disabled={!text} onClick={onClickSave}>保存二维码</button>
    </div>)
})