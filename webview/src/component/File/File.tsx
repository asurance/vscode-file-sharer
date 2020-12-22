import React, { memo, useCallback } from 'react'
import { PostMessage } from '../../message'
import { file, fileContent, button } from './FileArea.css'

interface IProps {
    fsPath: string;
    serverInfo: ServerInfo;
    uuid: string;
    onRemoveFile: (fileUrl: string) => void;
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
    onUpdateText,
}: Readonly<IProps>): JSX.Element {
    const fileUrl = GetFileUrl(serverInfo, uuid)
    const onClickRemove = useCallback(() => {
        onRemoveFile(uuid)
    }, [uuid, onRemoveFile])
    const onClickCopy = useCallback(() => {
        PostMessage({ type: 'CopyFileUrl', data: fileUrl })
    }, [fileUrl])
    const onClickUpdate = useCallback(() => {
        onUpdateText(fileUrl)
    }, [onUpdateText, fileUrl])
    return (<div className={file}>
        <div className={fileContent}>
            <span>{fsPath}</span>
            <button onClick={onClickRemove}>取消</button>
        </div>
        <div className={fileContent}>
            <span>{fileUrl}</span>
            <div className={button}>
                <button onClick={onClickCopy}>复制链接</button>
                <button onClick={onClickUpdate}>同步到文本框</button>
            </div>
        </div>
    </div>)
})