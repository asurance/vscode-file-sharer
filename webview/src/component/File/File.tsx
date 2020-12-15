import React, { memo, useCallback } from 'react'

interface IProps {
    fsPath: string;
    fileUrl: string;
    onRemoveFile: (fileUrl: string) => void;
    onCopyFile: (fileUrl: string) => void;
    onUpdateText: (fileUrl: string) => void;
}

export const File = memo(function File({
    fsPath,
    fileUrl,
    onRemoveFile,
    onCopyFile,
    onUpdateText,
}: Readonly<IProps>): JSX.Element {
    const onClickRemove = useCallback(() => {
        onRemoveFile(fileUrl)
    }, [fileUrl, onRemoveFile])
    const onClickCopy = useCallback(() => {
        onCopyFile(fileUrl)
    }, [fileUrl, onCopyFile])
    const onClickUpdate = useCallback(() => {
        onUpdateText(fileUrl)
    }, [fileUrl, onUpdateText])
    return (<div>
        <span>{fsPath}</span>
        <span>{fileUrl}</span>
        <button onClick={onClickRemove}>取消</button>
        <button onClick={onClickCopy}>复制链接</button>
        <button onClick={onClickUpdate}>同步到文本框</button>
    </div>)
})