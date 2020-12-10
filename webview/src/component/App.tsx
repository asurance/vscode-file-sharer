import React, { useCallback, useState } from 'react'
import { DefaultQRCodeText } from '../config'
import { root, list } from './App.css'
import { FileArea } from './File/FileArea'
import { QRCodeArea } from './QRCode/QRCodeArea'
import { ServerArea } from './Server/ServerArea'
import { TextArea } from './Text/TextArea'
import { UploadArea } from './Upload/UploadArea'

interface Props {
    postMessage: VSCode['postMessage'];
}

export function App({
    postMessage,
}: Readonly<Props>): JSX.Element {
    const [serveEnabled, setServerEnabled] = useState(false)
    const onServerEnableChanged = useCallback((enabled: boolean) => {
        setServerEnabled(enabled)
    }, [])
    return (<div className={root}>
        <div className={list}>
            <ServerArea postMessage={postMessage} onServerEnableChanged={onServerEnableChanged} />
            <QRCodeArea text={DefaultQRCodeText} />
            <TextArea />
        </div>
        <div className={list}>
            <FileArea />
            <UploadArea uploadPath="" />
        </div>
    </div>)
}