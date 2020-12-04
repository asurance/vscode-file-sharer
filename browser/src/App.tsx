import React, { useCallback, useState } from 'react'

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
    return (<div>
        <div>
            <button onClick={onRefreshClick}>更新</button>
            <button onClick={onSyncClick}>同步</button>
        </div>
        <textarea value={textValue} />
    </div>)
}