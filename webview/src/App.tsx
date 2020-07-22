import React from 'react'
import { File } from './File'
import { toCanvas } from 'qrcode'
import { Extra } from './Extra'
import { vscode } from '.'

interface Props {
    host: string;
    port: string;
}

interface State {
    select: number | null;
    fileList: FileInfo[];
}

export class App extends React.Component<Props, State> {
    private canvas: HTMLCanvasElement | null = null

    constructor(props: Readonly<Props>) {
        super(props)
        this.state = {
            select: null,
            fileList: vscode.getState() ?? [],
        }
        window.onmessage = this.onMessage
    }

    private get url(): string {
        if (this.state.select === null) {
            return 'Welcome to file sharer'
        } else {
            return `http://${this.props.host}:${this.props.port}/${this.state.fileList[this.state.select].uuid}`
        }
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
        this.setState({
            select: index
        })
    }

    private onRemove(index: number): void {
        const message: OutMessage<'DeleteFile'> = {
            type: 'DeleteFile',
            data: this.state.fileList[index].uuid
        }
        vscode.postMessage(message)
        const fileList = this.state.fileList.slice(0, index)
        fileList.push(...this.state.fileList.slice(index + 1))
        vscode.setState(fileList)
        if (fileList.length === 0)
            this.setState({
                select: null,
                fileList,
            })
        else {
            this.setState({
                select: Math.min(this.state.select!, fileList.length - 1),
                fileList,
            })
        }
    }

    private messageCB: { [key in keyof InMessageMap]: InMessageCB<key> } = {
        FileInfo: (data) => {
            const fileList = this.state.fileList.concat(data)
            vscode.setState(fileList)
            this.setState({
                select: fileList.length - 1,
                fileList,
            })
        },
    }

    private onMessage = (ev: MessageEvent): void => {
        if (ev.data.type in this.messageCB) {
            this.messageCB[ev.data.type as keyof InMessageMap](ev.data.data)
        }
    }

    private onCopy = (): void => {
        const message: OutMessage<'Copy'> = {
            type: 'Copy',
            data: this.url
        }
        vscode.postMessage(message)
    }

    render(): JSX.Element {
        const files = this.state.fileList.map((f, i) =>
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
        return (<div>
            <canvas ref={this.updateCanvas} />
            <div>
                <a href={url}>{url}</a>
                {this.state.select === null ? null : <button onClick={this.onCopy}>Copy</button>}
            </div>
            <div>{files}</div>
        </div>)
    }
}