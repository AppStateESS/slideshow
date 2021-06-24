'use strict'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Form
} from 'react-bootstrap'
import Tippy from '@tippyjs/react';
import './quiz.css'

const {Row, Group, Check , Control} = Form

// prop.types may equal 'choice' or 'select'
export default function AnswerBlock(props) {

    const [fb, setFb] = useState('') 

    useEffect(() => {
      const feed = [...props.feedback] // This will represent ['local' | 'global, globalField1, globalField2, ...arrayOfLocalFeedback]
      setFb(feed[props.id+3]) 
    }, [])

    useEffect(() => {
      let feed = [...props.feedback]
      feed[props.id + 3] = fb
      if (props.custom) {
        feed[0] = 'local'
      }
      props.setFeedback(feed)
    }, [fb])
    
    function _delete() {
        props.remove(props.id)
    }

    const customAnswerRow = (
      <Row className="custRow15" key={'custAns' + props.id} id={props.id}>
        <Group className="custResponse" controlId={'custAns-' + props.id}>
          <Control
            key={'custAns-' + props.id}
            value={fb}
            as={'textarea'}
            rows={2}
            onChange={(e) => setFb(e.target.value)}
          />
        </Group>
        <Group className="flexbox">
          <Tippy content={<div>Your custom message will be shown when user selects this answer</div>} arrow={true}>
              <span className="dg-small"><i className="fas fa-question-circle"></i></span>
          </Tippy>
        </Group>
      </Row>
    )

    return (
      <React.Fragment>
      <Row className="custRow10" key={'row-' + props.id} id={props.id}>
        <Group className="ans" controlId={'text-' + props.id}>
          <Control
            key={'text-' + props.id}
            value={props.value}
            onChange={props.onChange}
          />
        </Group>
        <Group id={'correct-' + props.id}>
          <Check
            custom
            type={props.type === 'choice' ? 'radio' : 'checkbox'}
            id={props.type + '-' + props.id}
            name={'choices'}
            label='Correct Answer'
            onChange={props.onChange}
            checked={props.checked}
          />
        </Group>
        <Group>
            <Tippy content={<span>Remove Answer</span>} arrow={true}>
            <span className="close card-text" aria-label="Close" onClick={_delete} style={{marginLeft: 15}}>
                <span className="ss-danger"><i className="fas fa-times"></i></span>
            </span>
            </Tippy>
        </Group>
      </Row>
      {(props.custom) ? customAnswerRow : null}
      </React.Fragment>
    )
}

AnswerBlock.propTypes = {
  id: PropTypes.number,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  checked: PropTypes.bool,
  type: PropTypes.string
}
