import React, { useCallback, useState } from 'react'
import { DefaultQRCodeText } from '../../config'
import { root, textArea } from './TextArea.css'

export function TextArea(): JSX.Element {
    const [text, setText] = useState('')
    const onInput = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(ev.target.value)
    }, [])
    return (<div className={root}>
        <textarea className={textArea} placeholder={DefaultQRCodeText} onChange={onInput} value={text} />
    </div>)
}