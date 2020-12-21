import React, { memo, useCallback, useEffect, useState } from 'react'
import { ClearCallback, PostMessage, SetCallback } from '../../message'
import { Extra } from './Extra'
import { File } from './File'

interface IProps {
    onUpdateText: (text: string) => void;
    serverInfo: ServerInfo;
}

export const FileArea = memo(function FileArea({
    onUpdateText,
    serverInfo,
}: Readonly<IProps>): JSX.Element {
    const [files, setFiles] = useState([] as FileInfo[])
    const onAddFile = (file: FileInfo): void => {
        setFiles([...files, file])
    }
    useEffect(() => {
        SetCallback('AddFile', onAddFile)
        return (): void => ClearCallback('AddFile')
    })
    const onRemoveFile = useCallback((uuid: string) => {
        const index = files.findIndex(file => file.uuid === uuid)
        if (index >= 0) {
            setFiles([...files.slice(0, index), ...files.slice(index + 1)])
            PostMessage({ type: 'RemoveFile', data: uuid })
        }
    }, [files])
    const onCopyFileUrl = useCallback((url: string) => {
        PostMessage({ type: 'CopyFileUrl', data: url })
    }, [])
    const fileElements = files.map(({ fsPath, uuid }) => <File
        key={uuid}
        fsPath={fsPath}
        uuid={uuid}
        serverInfo={serverInfo}
        onRemoveFile={onRemoveFile}
        onCopyFile={onCopyFileUrl}
        onUpdateText={onUpdateText}
    />)
    return (<div>
        {fileElements}
        <Extra />
    </div>)
})