import React from 'react'
import { render } from 'react-dom'
import { App } from './component/App'

render(<App api={acquireVsCodeApi()} />, document.getElementById('container'))
