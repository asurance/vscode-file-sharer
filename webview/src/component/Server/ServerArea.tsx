import React from 'react'
import { PostMessage, SetCallback } from '../../message'
import { root } from './ServerArea.css'

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
}

export class ServerArea extends React.PureComponent<IProps, IState> {
    constructor(props: Readonly<IProps>) {
        super(props)
        this.state = {
            step: ServerStep.Stop,
        }
        SetCallback('StartServer', this.onStartServerEnd)
    }

    private onStartServer = (): void => {
        PostMessage({ type: 'StartServer' })
        this.setState({ step: ServerStep.Starting })
    }

    private onStartServerEnd = (serverInfo: ServerInfo): void => {
        const {
            onServerChanged: onServerEnableChanged,
        } = this.props
        this.setState({ step: ServerStep.Start })
        onServerEnableChanged(serverInfo)
    }

    private onStopServer = (): void => {
        const {
            onServerChanged: onServerEnableChanged,
        } = this.props
        PostMessage({ type: 'StopServer' })
        this.setState({ step: ServerStep.Stop })
        onServerEnableChanged(null)
    }

    render(): JSX.Element {
        const {
            step,
        } = this.state
        let button: JSX.Element | null = null
        switch (step) {
            case ServerStep.Start:
                button = <button onClick={this.onStopServer}>停止</button>
                break
            case ServerStep.Stop:
                button = <button onClick={this.onStartServer}>启动</button>
                break
            case ServerStep.Starting:
                button = <button disabled>启动中</button>
                break
        }
        return (<div className={root}>
            {button}
        </div>)
    }
}