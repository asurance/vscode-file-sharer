import React from 'react'
import { Button } from './Button'

interface Props {
    name: string;
    select: boolean;
    onSelect: () => void;
    onRemove: () => void;
}

export function File(props: Readonly<Props>): JSX.Element {
    return (<div
        onClick={props.onSelect}
        style={{
            background: props.select ? '#f1f1f1' : '#3f3f3f',
            color: props.select ? '#3f3f3f' : '#f1f1f1',
            borderRadius: 5,
            margin: 6,
            padding: 6,
            display: 'flex',
            justifyContent: 'space-between',
        }}>
        <span >{props.name}</span>
        <Button style={{ margin: 3 }} onClick={props.onRemove} content="-" />
    </div>)
}