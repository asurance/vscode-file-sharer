import React from 'react'
import { root, list } from './App.css'
import { FileArea } from './File/FileArea'
import { QRCodeArea } from './QRCode/QRCodeArea'
import { ServerArea } from './Server/ServerArea'
import { TextArea } from './Text/TextArea'
import { UploadArea } from './Upload/UploadArea'

export function App(): JSX.Element {
    return (<div className={root}>
        <div className={list}>
            <ServerArea />
            <QRCodeArea text="hello" />
            <TextArea />
        </div>
        <div className={list}>
            <FileArea />
            <UploadArea uploadPath="" />
        </div>
    </div>)
}