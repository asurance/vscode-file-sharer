import React from 'react'
import { root, list } from './App.css'
import { FileArea } from './File/FileArea'
import { QRCodeArea } from './QRCode/QRCodeArea'
import { ServerArea } from './Server/ServerArea'
import { TextArea } from './Text/TextArea'
import { UploadArea } from './Upload/UploadArea'

interface Props {
    api: VSCode<Partial<State>>;
}

const defaultState: State = {
    text: ''
}

export function App({
    api,
}: Readonly<Props>): JSX.Element {
    const { text } = { ...defaultState, ...api.getState() }
    return (<div className={root}>
        <div className={list}>
            <ServerArea />
            <QRCodeArea text={text} />
            <TextArea />
        </div>
        <div className={list}>
            <FileArea />
            <UploadArea uploadPath="" />
        </div>
    </div>)
}