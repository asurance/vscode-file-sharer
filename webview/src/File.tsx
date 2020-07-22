import React from 'react'

interface Props {
    name: string;
    select: boolean;
    onSelect: () => void;
    onRemove: () => void;
}

export function File(props: Readonly<Props>): JSX.Element {
    return (<div><span onClick={props.onSelect}>{props.name}</span><button onClick={props.onRemove}>-</button></div>)
}