import React, { memo, useCallback, useEffect, useState } from 'react'
import { ClearCallback, PostMessage, SetCallback } from '../../message'
import { Extra } from './Extra'
import { File } from './File'

interface IProps {
    onUpdateText: (text: string) => void;
}

export const FileArea = memo(function FileArea({
    onUpdateText,
}: Readonly<IProps>): JSX.Element {
    const [files, setFiles] = useState([] as { fsPath: string; url: string }[])
    const onAddFile = (file: { fsPath: string; url: string } | null): void => {
        if (file) {
            setFiles([...files, file])
        }
    }
    useEffect(() => {
        SetCallback('AddFile', onAddFile)
        return (): void => ClearCallback('AddFile')
    })
    const onRemoveFile = useCallback((fileUrl) => {
        const index = files.indexOf(fileUrl)
        if (index >= 0) {
            setFiles([...files.slice(0, index), ...files.slice(index + 1)])
            PostMessage({ type: 'RemoveFile', data: fileUrl })
        }
    }, [files])
    const onCopyFileUrl = useCallback((fileUrl) => {
        PostMessage({ type: 'CopyFileUrl', data: fileUrl })
    }, [])
    const fileElements = files.map(({ fsPath, url }) => <File
        key={url}
        fsPath={fsPath}
        fileUrl={url}
        onRemoveFile={onRemoveFile}
        onCopyFile={onCopyFileUrl}
        onUpdateText={onUpdateText}
    />)
    return (<div>
        {fileElements}
        <Extra />
    </div>)
})