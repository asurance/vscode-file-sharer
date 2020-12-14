import React, { memo, useCallback } from 'react'
import { PostMessage } from '../../message'

export const Extra = memo(function Extra(): JSX.Element {
    const onClickAdd = useCallback(() => {
        PostMessage({ type: 'AddFile' })
    }, [])
    return <button onClick={onClickAdd}>添加</button>
})