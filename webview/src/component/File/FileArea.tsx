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
    const [files, setFiles] = useState([] as string[])
    const onAddFile = (file: string | undefined): void => {
        if (file !== undefined) {
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
    const fileElements = files.map(str => <File
        key={str}
        fileUrl={str}
        onRemoveFile={onRemoveFile}
        onCopyFile={onCopyFileUrl}
        onUpdateText={onUpdateText}
    />)
    return (<div>
        {fileElements}
        <Extra />
    </div>)
})