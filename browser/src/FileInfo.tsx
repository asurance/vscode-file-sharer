import React, { memo, useCallback, useState } from 'react'
import { root, frame, progress } from './FileInfo.css'

export interface IFileInfoProps {
    key: string;
    name: string;
    percent: number;
}

export const FileInfo = memo(function FileInfo({
    name,
    percent,
}: IFileInfoProps): JSX.Element {
    const [height, setHeight] = useState(0)
    const onGetHeightRef = useCallback((ref: HTMLDivElement | null) => {
        if (ref) {
            setHeight(ref.offsetHeight)
        }
    }, [])
    return (<div className={root}
        style={{ height }}>
        <div ref={onGetHeightRef}
            className={frame}
        >
            {name}
        </div>
        <div className={progress} style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}>
            {name}
        </div>
    </div >)
})