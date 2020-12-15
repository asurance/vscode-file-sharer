import React, { useCallback, useState } from 'react'
import { root, buttonList, textArea } from './App.css'
import { DefaultQRCodeText } from './config'

interface Props {
    serverUrl: string;
}

export function App({ serverUrl }: Readonly<Props>): JSX.Element {
    const [textValue, setTextValue] = useState('')
    const onRefreshClick = useCallback(() => {
        fetch(serverUrl).then(async response => setTextValue(await response.text()))
    }, [serverUrl])
    const onSyncClick = useCallback(() => {
        fetch(serverUrl, { method: 'post', body: textValue })
    }, [serverUrl, textValue])
    const onInput = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextValue(ev.target.value)
    }, [])
    return (<div className={root}>
        <div className={buttonList}>
            <button onClick={onRefreshClick}>更新</button>
            <button onClick={onSyncClick}>同步</button>
        </div>
        <textarea
            className={textArea}
            value={textValue}
            onChange={onInput}
            placeholder={DefaultQRCodeText}
        />
    </div>)
}