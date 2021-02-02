import React, { memo, useCallback, useState } from 'react'
import { toCanvas } from 'qrcode'
import { root, list, hidden } from './QRCodeArea.css'
import { DefaultQRCodeText } from '../../config'
import { PostMessage } from '../../message'

interface IProps {
    text: string;
}

export const QRCodeArea = memo(function QRCodeArea({
    text
}: Readonly<IProps>): JSX.Element {
    const [showQRCode, setShowQRCode] = useState(true)
    const onClickSave = useCallback(() => {
        PostMessage({ type: 'SaveQRCode', data: text })
    }, [text])
    const onClickCheckBox = useCallback(() => {
        setShowQRCode(v => !v)
    }, [])
    return (<div className={root}>
        <canvas
            className={showQRCode ? '' : hidden}
            ref={(ref): Promise<void> | null =>
                ref && toCanvas(ref, text || DefaultQRCodeText)}
        />
        <div className={list}>
            <button className={showQRCode ? '' : hidden} disabled={!text} onClick={onClickSave}>保存二维码</button>
            <button onClick={onClickCheckBox}>{showQRCode ? '隐藏二维码' : '显示二维码'}</button>
        </div>
    </div>)
})