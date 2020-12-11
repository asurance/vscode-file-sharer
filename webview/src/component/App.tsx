import React, { PureComponent } from 'react'
import { DefaultQRCodeText } from '../config'
import { ClearCallback, SetCallback } from '../message'
import { debounce } from '../util'
import { root, list } from './App.css'
import { FileArea } from './File/FileArea'
import { QRCodeArea } from './QRCode/QRCodeArea'
import { ServerArea } from './Server/ServerArea'
import { TextArea } from './Text/TextArea'
import { UploadArea } from './Upload/UploadArea'

interface IProps {
    postMessage: VSCode['postMessage'];
}

interface IState {
    text: string;
    serverEnabled: boolean;
}
export class App extends PureComponent<IProps, IState> {

    private syncText: (text: string) => void

    constructor(props: Readonly<IProps>) {
        super(props)
        this.syncText = debounce((text) => this.props.postMessage({ type: 'SyncText', data: text }), 250)
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
            postMessage,
        } = this.props
        const {
            text,
            serverEnabled,
        } = this.state
        return (<div className={root}>
            <div className={list}>
                <ServerArea postMessage={postMessage} onServerEnableChanged={this.onServerEnabledChange} />
                <QRCodeArea text={text} />
                <TextArea text={text} onTextChange={this.onTextChange} />
            </div>
            <div className={list}>
                <FileArea />
                <UploadArea uploadPath="" />
            </div>
        </div>)
    }

}