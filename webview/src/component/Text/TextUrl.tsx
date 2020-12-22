import React, { memo, useCallback } from 'react'
import { PostMessage } from '../../message'
import { textUrl } from './TextArea.css'

interface IProps {
    url: string;
    onUpdateText: (fileUrl: string) => void;
}

export const TextUrl = memo(function TextUrl({
    url,
    onUpdateText,
}: Readonly<IProps>) {
    const onClickUpdate = useCallback(() => {
        onUpdateText(url)
    }, [onUpdateText, url])
    const onClickCopy = useCallback(() => {
        PostMessage({ type: 'CopyFileUrl', data: url })
    }, [url])
    return (<div className={textUrl} >
        <span>{url}</span>
        <div>
            <button onClick={onClickCopy}>复制链接</button>
            <button onClick={onClickUpdate}>同步到文本框</button>
        </div>
    </div>)
})