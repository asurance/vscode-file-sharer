import React, { memo, useCallback } from 'react'
import { DefaultQRCodeText } from '../../config'
import { root, textArea } from './TextArea.css'

interface IProps {
    text: string;
    onTextChange: (text: string) => void;
    serverInfo: ServerInfo | null;
}

function GetSyncTextUrl(serverInfo: ServerInfo): string {
    return `http://${serverInfo.host}:${serverInfo.port}/text`
}

export const TextArea = memo(function TextArea({
    serverInfo,
    text,
    onTextChange,
}: Readonly<IProps>): JSX.Element {
    const onInput = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        onTextChange(ev.target.value)
    }, [onTextChange])
    return (<div className={root}>
        {serverInfo ? <div>{GetSyncTextUrl(serverInfo)}</div> : null}
        <textarea className={textArea} placeholder={DefaultQRCodeText} onChange={onInput} value={text} />
    </div>)
})