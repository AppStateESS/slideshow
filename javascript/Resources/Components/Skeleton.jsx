import React from 'react'
export default function Skeleton(props) {
    const title = (props.title === undefined) ? "Loading show..." : props.title
    return (
        <div className="text-center" style={spinner}>
            <p>{title}</p>
            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

const spinner = {
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: '10rem',
}