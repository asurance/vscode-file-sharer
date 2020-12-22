import React, { memo, useCallback } from 'react'
import { PostMessage } from '../../message'
import { add } from './FileArea.css'

export const Extra = memo(function Extra(): JSX.Element {
    const onClickAdd = useCallback(() => {
        PostMessage({ type: 'AddFile' })
    }, [])
    return <div className={add}>
        <button onClick={onClickAdd}>添加文件</button>
    </div>
})