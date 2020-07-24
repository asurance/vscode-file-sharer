import React from 'react'

interface Props {
    style?: React.CSSProperties;
    content: string;
    onClick: () => void;
}

interface State {
    hover: boolean;
    select: boolean;
}

export class Button extends React.Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props)
        this.state = {
            hover: false,
            select: false,
        }
    }

    private onMouseEnter = (): void => {
        this.setState({
            hover: true
        })
    }

    private onMouseLeave = (): void => {
        this.setState({
            hover: false,
            select: false,
        })
    }

    private onMouseDown = (): void => {
        this.setState({
            select: true
        })
    }

    private onMouseUp = (): void => {
        if (this.state.hover && this.state.select) {
            this.setState({
                select: false
            })
            this.props.onClick()
        }
    }

    render(): JSX.Element {
        const style: React.CSSProperties = {
            ...this.props.style ?? {},
            outline: 'none',
            backgroundColor: '#f2f2f2',
            border: '1px solid #bfbfbf',
            boxShadow: 'inset 0 1px 0 white, inset 0 -1px 0 #d9d9d9, inset 0 0 0 1px #f2f2f2, 0 2px 4px rgba(0, 0, 0, 0.2)',
            color: '#8c8c8c',
            textShadow: '0 1px 0 rgba(255, 255, 255, 0.5)',
            borderRadius: 3,
            cursor: 'pointer',
            verticalAlign: 'top',
            ...this.state.select ? {
                boxShadow: 'inset 0 2px 3px rgba(0, 0, 0, 0.2)',
            } : this.state.hover ? {
                boxShadow: 'inset 0 1px 0 white, inset 0 -1px 0 #d9d9d9, inset 0 0 0 1px #f2f2f2'
            } : {}
        }
        return (<button style={style} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>{this.props.content}</button>)
    }
}