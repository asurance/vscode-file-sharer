import React, { memo, useCallback } from 'react'
import { DefaultQRCodeText } from '../../config'
import { root, textArea } from './TextArea.css'

interface IProps {
    text: string;
    onTextChange: (text: string) => void;
}

export const TextArea = memo(function TextArea({
    text,
    onTextChange,
}: Readonly<IProps>): JSX.Element {
    const onInput = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        onTextChange(ev.target.value)
    }, [onTextChange])
    return (<div className={root}>
        <textarea className={textArea} placeholder={DefaultQRCodeText} onChange={onInput} value={text} />
    </div>)
})