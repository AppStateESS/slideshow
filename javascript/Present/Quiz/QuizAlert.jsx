import React from 'react'
import { Alert } from 'react-bootstrap'
export default function QuizAlert(props) {
    let alert = undefined

    const select_index = props.selected[0] + 3
    const right_message = (props.feedback[0] === 'global' || props.qType === 'select') 
                ? props.feedback[1] : props.feedback[select_index]
    const wrong_message = (props.feedback[0] === 'global' || props.qType === 'select') 
                ? props.feedback[2] : props.feedback[select_index]
    switch (props.state) {
        case 'correct':
            alert = (<Alert key={'correct'} variant="success">
                <span><i className="fas fa-check-circle" style={{ color: "green" }}></i> {right_message}</span>
            </Alert>)
            break;
        case 'incorrect':
            alert = (<Alert key={'incorrect'} variant="danger">
                <span><i className="fas fa-times-circle"></i> {wrong_message}</span>
            </Alert>)
            break;
        case 'partial':
            alert = (<Alert key={'partial'} variant="warning">
                <span><i className="fas fa-exclamation-circle"></i> You are partially correct</span>
            </Alert>)
            break;
        case 'initial':
        default:
            alert = <Alert key={'initial'} variant="dark">Select the correct answer to continue</Alert>
            break;
    }

    return (
        <span style={{width: '100%'}}>{alert}</span>
    )
}