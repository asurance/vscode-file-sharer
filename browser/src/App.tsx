import React, { useCallback, useState } from 'react'
import { root, buttonList, textArea } from './App.css'
import { DefaultQRCodeText } from './config'

export function App(): JSX.Element {
    const [textValue, setTextValue] = useState('')
    const onRefreshClick = useCallback(() => {
        fetch('syncText').then(async response => setTextValue(await response.text()))
    }, [])
    const onSyncClick = useCallback(() => {
        fetch('syncText', { method: 'put', body: textValue })
    }, [textValue])
    const onInput = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextValue(ev.target.value)
    }, [])
    return (<div className={root}>
        <div className={buttonList}>
            <button title="更新" onClick={onRefreshClick}>⬇</button>
            <button title="同步" onClick={onSyncClick}>⬆</button>
        </div>
        <textarea
            className={textArea}
            value={textValue}
            onChange={onInput}
            placeholder={DefaultQRCodeText}
        />
    </div>)
}