import React from 'react'
import { render } from 'react-dom'
import { App } from './component/App'

render(<App postMessage={acquireVsCodeApi().postMessage} />, document.getElementById('container'))
