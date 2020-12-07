import React from 'react'
import { Default } from '../config'

export function TextArea(): JSX.Element {
    return (<div>
        <textarea placeholder={Default.QRCodeText} />
    </div>)
}