import React from 'react'
import { PostMessage, SetCallback } from '../../message'
import { root, portText, portTip } from './ServerArea.css'

const enum ServerStep {
    Start,
    Stop,
    Starting,
}

interface IProps {
    onServerChanged: (serverInfo: ServerInfo | null) => void;
}

interface IState {
    step: ServerStep;
    port: string;
}

export class ServerArea extends React.PureComponent<IProps, IState> {
    constructor(props: Readonly<IProps>) {
        super(props)
        this.state = {
            step: ServerStep.Stop,
            port: '10086'
        }
        SetCallback('StartServer', this.onStartServerEnd)
    }

    private onStartServer = (): void => {
        const {
            port,
        } = this.state
        let actualPort: number | null = null
        if (port) {
            actualPort = parseInt(port)
            if (actualPort >= 65536) {
                PostMessage({ type: 'ShowError', data: '端口需在[0,65535]中' })
                return
            }
        }
        PostMessage({ type: 'StartServer', data: actualPort })
        this.setState({ step: ServerStep.Starting })
    }

    private onStartServerEnd = (serverInfo: ServerInfo | null): void => {
        const {
            onServerChanged,
        } = this.props
        if (serverInfo) {
            this.setState({ step: ServerStep.Start })
        } else {
            this.setState({ step: ServerStep.Stop })
        }
        onServerChanged(serverInfo)
    }

    private onStopServer = (): void => {
        const {
            onServerChanged: onServerEnableChanged,
        } = this.props
        PostMessage({ type: 'StopServer' })
        this.setState({ step: ServerStep.Stop })
        onServerEnableChanged(null)
    }

    private onPortChange = (evt: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const {
            port,
        } = this.state
        const nextPort = evt.target.value.replace(/[^0-9]/g, '').substr(0, 5)
        if (nextPort !== port) {
            this.setState({ port: nextPort })
        }
    }

    render(): JSX.Element {
        const {
            step,
            port,
        } = this.state
        let button: JSX.Element | null = null
        switch (step) {
            case ServerStep.Start:
                button = <button onClick={this.onStopServer}>停止服务器</button>
                break
            case ServerStep.Stop:
                button = <button onClick={this.onStartServer}>启动服务器</button>
                break
            case ServerStep.Starting:
                button = <button disabled>服务器启动中</button>
                break
        }
        return (<div className={root}>
            {button}
            <span className={portTip}>端口号(空为随机):</span>
            <textarea className={portText} rows={1} cols={12} value={port} onChange={this.onPortChange} />
        </div>)
    }
}