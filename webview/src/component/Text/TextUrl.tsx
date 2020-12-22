import React, { memo, useCallback } from 'react'

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
    return (<div>
        <span>{url}</span>
        <button onClick={onClickUpdate}>同步到文本框</button>
    </div>)
})