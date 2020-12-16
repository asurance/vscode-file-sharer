import React from 'react'
import { PostMessage, SetCallback } from '../../message'
import { root } from './ServerArea.css'

const enum ServerStep {
    Start,
    Stop,
    Starting,
}

interface IProps {
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
    }

    private onStartServer = (): void => {
        PostMessage({ type: 'StartServer' })
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
            onServerEnableChanged,
        } = this.props
        PostMessage({ type: 'StopServer' })
        this.setState({ step: ServerStep.Stop })
        onServerEnableChanged(false)
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
        }
        return (<div className={root}>
            {button}
            {step === ServerStep.Start ? `文本同步链接:${url}` : null}
        </div>)
    }
}