import React from 'react'
import { root, list } from '../style/App.css'
import { FileArea } from './FileArea'
import { QRCodeArea } from './QRCodeArea'
import { ServerArea } from './ServerArea'
import { TextArea } from './TextArea'
import { UploadArea } from './UploadArea'

export function App(): JSX.Element {
    return (<div
        className={root}
    >
        <div className={list}>
            <ServerArea />
            <QRCodeArea text="hello" />
            <TextArea />
        </div>
        <div className={list}>
            <FileArea />
            <UploadArea />
        </div>
    </div>)
}