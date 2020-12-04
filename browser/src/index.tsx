import React from 'react'
import { render } from 'react-dom'
import { App } from './App'

const meta = document.getElementById('data') as HTMLMetaElement
const serverUrl = meta.getAttribute('serverUrl') ?? ''

render(<App serverUrl={serverUrl} />, document.getElementById('container'))