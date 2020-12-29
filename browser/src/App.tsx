import React, { useCallback, useState } from 'react'
import { root, buttonList, textArea } from './App.css'
import { DefaultQRCodeText } from './config'
import { FileInfo } from './FileInfo'

export function App(): JSX.Element {
    const [textValue, setTextValue] = useState('')
    const [fileValue, setFileValue] = useState('')
    const [uploadFiles, setUploadFiles] = useState<File[]>([])
    const onRefreshClick = useCallback(() => {
        fetch('syncText').then(async response => setTextValue(await response.text()))
    }, [])
    const onSyncClick = useCallback(() => {
        fetch('syncText', { method: 'put', body: textValue })
    }, [textValue])
    const onInput = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextValue(ev.target.value)
    }, [])
    const onFileInput = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target.files) {
            setUploadFiles([...uploadFiles, ...evt.target.files])
            setFileValue('')
        }
    }, [uploadFiles])
    const onFileUploaded = useCallback((file: File) => {
        const index = uploadFiles.indexOf(file)
        if (index >= 0) {
            const f = [...uploadFiles.slice(0, index), ...uploadFiles.slice(index + 1)]
            console.log(f.length)
            setUploadFiles(f)
        }
    }, [uploadFiles])
    return (<div className={root}>
        <div className={buttonList}>
            <button onClick={onRefreshClick}>更新文本</button>
            <input value={fileValue} type="file" onChange={onFileInput} multiple />
            <button onClick={onSyncClick}>上传文本</button>
        </div>
        {
            uploadFiles.map(file => <FileInfo key={file.name} file={file} onFinish={onFileUploaded} />)
        }
        <textarea
            className={textArea}
            value={textValue}
            onChange={onInput}
            placeholder={DefaultQRCodeText}
        />
    </div>)
}