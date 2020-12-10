import React from 'react'
import { SetCallback } from '../../message'
import { root } from './ServerArea.css'

const enum ServerStep {
    Start,
    Stop,
    Starting,
    Stoping,
}

interface IProps {
    postMessage: VSCode['postMessage'];
    onServerEnableChanged: (enable: boolean) => void;
}

interface IState {
    step: ServerStep;
    url: string;
}

export class ServerArea extends React.PureComponent<IProps, IState> {
    constructor(props: Readonly<IProps>) {
        super(props)
        this.state = {
            step: ServerStep.Stop,
            url: '',
        }
        SetCallback('StartServer', this.onStartServerEnd)
        SetCallback('StopServer', this.onStopServerEnd)
    }

    private onStartServer = (): void => {
        const {
            postMessage,
        } = this.props
        postMessage({ type: 'StartServer' })
        this.setState({ step: ServerStep.Starting })
    }

    private onStartServerEnd = (url: string): void => {
        const {
            onServerEnableChanged,
        } = this.props
        this.setState({ step: ServerStep.Start, url })
        onServerEnableChanged(true)
    }

    private onStopServer = (): void => {
        const {
            postMessage,
            onServerEnableChanged,
        } = this.props
        postMessage({ type: 'StopServer' })
        this.setState({ step: ServerStep.Stoping })
        onServerEnableChanged(false)
    }

    private onStopServerEnd = (): void => {
        this.setState({ step: ServerStep.Stop })
    }

    render(): JSX.Element {
        const {
            step,
            url,
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
            case ServerStep.Stoping:
                button = <button disabled>停止中</button>
                break
        }
        return (<div className={root}>
            {button}
            {step === ServerStep.Start ? `当前服务器链接:${url}` : null}
        </div>)
    }
}