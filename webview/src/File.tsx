import React from 'react'
import { Button } from './Button'

interface Props {
    name: string;
    select: boolean;
    onSelect: () => void;
    onRemove: () => void;
}

export function File(props: Readonly<Props>): JSX.Element {
    return (<div><span onClick={props.onSelect}>{props.name}</span><Button onClick={props.onRemove} content="-" /></div>)
}