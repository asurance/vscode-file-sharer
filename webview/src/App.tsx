import React from 'react'
import { File } from './File'
import { toCanvas } from 'qrcode'
import { Extra } from './Extra'
import { vscode } from './index'
import { Button } from './Button'

interface Props {
    host: string;
    port: string;
}

interface State {
    select: number | null;
    fileInfo: FileInfo[];
}

export class App extends React.Component<Props, State> {
    private canvas: HTMLCanvasElement | null = null

    constructor(props: Readonly<Props>) {
        super(props)
        this.state = vscode.getState() ?? {
            select: null,
            fileInfo: [],
        }
        window.onmessage = this.onMessage
    }

    private get url(): string {
        if (this.state.select === null) {
            return 'Welcome to file sharer'
        } else {
            return `http://${this.props.host}:${this.props.port}/${this.state.fileInfo[this.state.select].uuid}`
        }
    }

    private save(): void {
        vscode.setState(this.state)
    }

    private setStateWithSave<K extends keyof State>(
        state: (Pick<State, K> | State | null),
    ): void {
        this.setState<K>(state, this.save)
    }

    private updateCanvas = (canvas: HTMLCanvasElement | null): void => {
        this.canvas = canvas
        this.renderCanvas()
    }

    private renderCanvas(): void {
        if (this.canvas) {
            toCanvas(this.canvas, this.url)
        }
    }

    private onSelect(index: number): void {
        this.setStateWithSave({
            select: index
        })
    }

    private onRemove(index: number): void {
        const message: OutMessage<'DeleteFile'> = {
            type: 'DeleteFile',
            data: this.state.fileInfo[index].uuid
        }
        vscode.postMessage(message)
        const fileList = this.state.fileInfo.slice(0, index)
        fileList.push(...this.state.fileInfo.slice(index + 1))
        if (fileList.length === 0)
            this.setStateWithSave({
                select: null,
                fileInfo: fileList,
            })
        else {
            this.setStateWithSave({
                select: Math.min(this.state.select!, fileList.length - 1),
                fileInfo: fileList,
            })
        }
    }

    private messageCB: { [key in keyof InMessageMap]: InMessageCB<key> } = {
        FileInfo: (data) => {
            const fileList = this.state.fileInfo.concat(data)
            this.setStateWithSave({
                select: fileList.length - 1,
                fileInfo: fileList,
            })
        },
    }

    private onMessage = (ev: MessageEvent): void => {
        if (ev.data.type in this.messageCB) {
            this.messageCB[ev.data.type as keyof InMessageMap](ev.data.data)
        }
    }

    private onCopy = (): void => {
        console.log('copy')
        const message: OutMessage<'Copy'> = {
            type: 'Copy',
            data: this.url
        }
        vscode.postMessage(message)
    }

    render(): JSX.Element {
        const files = this.state.fileInfo.map((f, i) =>
            <File
                key={f.uuid}
                select={this.state.select === i}
                name={f.name}
                onSelect={(): void => this.onSelect(i)}
                onRemove={(): void => this.onRemove(i)}
            />)
        files.push(<Extra key="extra" />)
        this.renderCanvas()
        const url = this.url
        return (<div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <canvas ref={this.updateCanvas} />
            {this.state.select === null ? null :
                <div style={{
                    background: '#f1f1f1',
                    color: '#6e6b5e',
                }}>
                    <a href={url}>{url}</a>
                    <Button onClick={this.onCopy} content="Copy" />
                </div>}
            <div>{files}</div>
        </div>)
    }
}