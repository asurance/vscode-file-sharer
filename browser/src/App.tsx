import React, { useCallback, useState } from 'react'
import { root, buttonList, textArea } from './App.css'
import { DefaultQRCodeText } from './config'
import { FileInfo, IFileInfoProps } from './FileInfo'
import { useArray } from './useArray'
import { createUUID, UploadFile } from './util'

const fileUuidSet = new Set<string>()

export function App(): JSX.Element {
    const [textValue, setTextValue] = useState('')
    const [fileValue, setFileValue] = useState('')
    const {
        state: files,
        add: addFile,
        remove: removeFile,
        update: updateFile,
    } = useArray<IFileInfoProps>()
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
            for (const file of evt.target.files) {
                let uuid = createUUID()
                while (fileUuidSet.has(uuid)) {
                    uuid = createUUID()
                }
                fileUuidSet.add(uuid)
                const fileInfo: IFileInfoProps = {
                    key: uuid, name: file.name, percent: 0
                }
                addFile(fileInfo)
                UploadFile(file, (percent: number) => {
                    fileInfo.percent = percent
                    updateFile(fileInfo)
                }).then(() => {
                    fileUuidSet.delete(uuid)
                    removeFile(fileInfo)
                }, () => {
                    fileUuidSet.delete(uuid)
                    removeFile(fileInfo)
                })
            }
            setFileValue('')
        }
    }, [addFile, updateFile, removeFile])
    return (<div className={root}>
        <div className={buttonList}>
            <button onClick={onRefreshClick}>更新文本</button>
            <input value={fileValue} type="file" onChange={onFileInput} multiple />
            <button onClick={onSyncClick}>上传文本</button>
        </div>
        {
            // eslint-disable-next-line react/jsx-key
            files.map(file => <FileInfo {...file} />)
        }
        <textarea
            className={textArea}
            value={textValue}
            onChange={onInput}
            placeholder={DefaultQRCodeText}
        />
    </div>)
}