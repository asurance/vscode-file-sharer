import React, { memo, useCallback } from 'react'

interface IProps {
    fileUrl: string;
    onRemoveFile: (fileUrl: string) => void;
    onCopyFile: (fileUrl: string) => void;
    onUpdateText: (fileUrl: string) => void;
}

export const File = memo(function File({
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
    return (<div>{fileUrl}
        <button onClick={onClickRemove}>取消</button>
        <button onClick={onClickCopy}>复制链接</button>
        <button onClick={onClickUpdate}>同步到文本框</button>
    </div>)
})