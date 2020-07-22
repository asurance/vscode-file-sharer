import React from 'react'
import { render } from 'react-dom'
import { App } from './App'

export const vscode = acquireVsCodeApi()

const meta = document.getElementById('data') as HTMLMetaElement
const host = meta.getAttribute('host') as string
const port = meta.getAttribute('port') as string
render(<App host={host} port={port} />, document.getElementById('container'))
