import React, { memo, useCallback } from 'react'

interface IProps {
    fsPath: string;
    serverInfo: ServerInfo;
    uuid: string;
    onRemoveFile: (fileUrl: string) => void;
    onCopyFile: (fileUrl: string) => void;
    onUpdateText: (fileUrl: string) => void;
}

function GetFileUrl(serverInfo: ServerInfo, uuid: string): string {
    return `http://${serverInfo.host}:${serverInfo.port}/file/${uuid}`
}

export const File = memo(function File({
    fsPath,
    serverInfo,
    uuid,
    onRemoveFile,
    onCopyFile,
    onUpdateText,
}: Readonly<IProps>): JSX.Element {
    const fileUrl = GetFileUrl(serverInfo, uuid)
    const onClickRemove = useCallback(() => {
        onRemoveFile(uuid)
    }, [uuid, onRemoveFile])
    const onClickCopy = useCallback(() => {
        onCopyFile(fileUrl)
    }, [onCopyFile, fileUrl])
    const onClickUpdate = useCallback(() => {
        onUpdateText(fileUrl)
    }, [onUpdateText, fileUrl])
    return (<div>
        <span>{fsPath}</span>
        <span>{fileUrl}</span>
        <button onClick={onClickRemove}>取消</button>
        <button onClick={onClickCopy}>复制链接</button>
        <button onClick={onClickUpdate}>同步到文本框</button>
    </div>)
})