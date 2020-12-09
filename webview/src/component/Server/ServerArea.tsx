import React from 'react'
import { root } from './ServerArea.css'

export function ServerArea(): JSX.Element {
    return (<div className={root}>
        <button>开启</button>
        <span>当前服务器链接</span>
    </div>)
}