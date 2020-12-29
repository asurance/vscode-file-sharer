import React, { PureComponent } from 'react'
import { root, frame, mask, progress } from './FileInfo.css'
import { UploadFile } from './util'

interface IProps {
    file: File;
    onFinish: (file: File) => void;
}

interface IState {
    percent: number;
    width: number;
    height: number;
}

export class FileInfo extends PureComponent<IProps, IState>{

    private widthRef: HTMLDivElement | null = null

    constructor(props: Readonly<IProps>) {
        super(props)
        this.state = {
            percent: 0,
            width: 0,
            height: 0,
        }
        this.onFinish = this.props.onFinish.bind(this, this.props.file)
        UploadFile(props.file, this.onProgress).then(() => this.onFinish?.())
    }

    private onFinish: (() => void) | null = null

    private onProgress = (percent: number): void => {
        this.setState({ percent })
    }

    private onGetHeightRef = (ref: HTMLDivElement | null): void => {
        if (ref) {
            this.setState({ height: ref.offsetHeight })
        }
    }

    private onGetWidthRef = (ref: HTMLDivElement | null): void => {
        this.widthRef = ref
        if (ref) {
            this.setState({ width: ref.offsetWidth })
        }
    }

    private onWindowResize = (): void => {
        if (this.widthRef) {
            this.setState({ width: this.widthRef.offsetWidth })
        }
    }

    componentDidMount(): void {
        window.addEventListener('resize', this.onWindowResize)
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.onWindowResize)
        this.onFinish = null
    }

    render(): JSX.Element {
        const {
            file,
        } = this.props
        const {
            percent,
            width,
            height,
        } = this.state
        return (<div className={root}
            ref={this.onGetWidthRef}
            style={{ height }}>
            <div ref={this.onGetHeightRef}
                className={frame}
                style={{ width }}
            >
                {file.name}
            </div>
            <div style={{ width: width / 100 * percent, height }}
                className={mask}
            >
                <div className={progress} style={{ width }}>
                    {file.name}
                </div>
            </div>
        </div >)
    }
}