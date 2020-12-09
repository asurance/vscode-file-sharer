import React from 'react'

interface Props {
    uploadPath: string;
}

export function UploadArea({
    uploadPath
}: Readonly<Props>): JSX.Element {
    if (uploadPath.length > 0) {
        return (<div>

        </div>)
    } else {
        return (<div>

        </div>)
    }
}