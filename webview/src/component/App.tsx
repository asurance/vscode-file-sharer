import React, { PureComponent } from 'react'
import { ClearCallback, PostMessage, SetCallback } from '../message'
import { debounce } from '../util'
import { root } from './App.css'
import { FileArea } from './File/FileArea'
import { QRCodeArea } from './QRCode/QRCodeArea'
import { ServerArea } from './Server/ServerArea'
import { TextArea } from './Text/TextArea'

interface IState {
    text: string;
    serverInfo: ServerInfo | null;
}
export class App extends PureComponent<unknown, IState> {

    private syncText: (text: string) => void

    constructor(props: Readonly<unknown>) {
        super(props)
        this.syncText = debounce((text) => PostMessage({ type: 'SyncText', data: text }), 250)
        this.state = {
            text: '',
            serverInfo: null,
        }
    }

    private onServerChanged = (serverInfo: ServerInfo | null): void => {
        this.setState({ serverInfo })
    }

    private onTextChange = (text: string): void => {
        this.setState({ text })
        this.syncText(text)
    }

    private onSyncText = (text: string): void => {
        this.setState({ text })
    }

    componentDidMount(): void {
        SetCallback('SyncText', this.onSyncText)
    }

    componentWillUnmount(): void {
        ClearCallback('SyncText')
    }

    render(): JSX.Element {
        const {
            text,
            serverInfo,
        } = this.state
        return (<div className={root}>
            <ServerArea onServerChanged={this.onServerChanged} />
            <QRCodeArea text={text} />
            <TextArea text={text} serverInfo={serverInfo} onTextChange={this.onTextChange} />
            {serverInfo ? <FileArea serverInfo={serverInfo} onUpdateText={this.onTextChange} /> : null}
        </div>)
    }

}