import React, { PureComponent } from 'react'
import { DefaultQRCodeText } from '../config'
import { ClearCallback, PostMessage, SetCallback } from '../message'
import { debounce } from '../util'
import { root } from './App.css'
import { FileArea } from './File/FileArea'
import { QRCodeArea } from './QRCode/QRCodeArea'
import { ServerArea } from './Server/ServerArea'
import { TextArea } from './Text/TextArea'

interface IState {
    text: string;
    serverEnabled: boolean;
}
export class App extends PureComponent<unknown, IState> {

    private syncText: (text: string) => void

    constructor(props: Readonly<unknown>) {
        super(props)
        this.syncText = debounce((text) => PostMessage({ type: 'SyncText', data: text }), 250)
        this.state = {
            text: DefaultQRCodeText,
            serverEnabled: false,
        }
    }

    private onServerEnabledChange = (enabled: boolean): void => {
        this.setState({ serverEnabled: enabled })
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
            serverEnabled,
        } = this.state
        return (<div className={root}>
            <ServerArea onServerEnableChanged={this.onServerEnabledChange} />
            <QRCodeArea text={text} />
            <TextArea text={text} onTextChange={this.onTextChange} />
            {serverEnabled ? <FileArea /> : null}
        </div>)
    }

}