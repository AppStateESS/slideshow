'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {
  Form
} from 'react-bootstrap'
import Tippy from '@tippy.js/react';

const {Row, Group, Check , Control} = Form

// prop.types may equal 'choice' or 'select'
export default function AnswerBlock(props) {

    function _delete() {
        props.remove(props.id)
    }

    return (
      <Row key={'row-' + props.id} id={props.id} style={rowStyle}>
        <Group controlId={'text-' + props.id} style={{ width: '60%', marginRight: '1rem' }}>
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
                <span style={{ color: "#d9534f" }}><i className="fas fa-times"></i></span>
            </span>
            </Tippy>
        </Group>
      </Row>
    )
}

const rowStyle = {
  marginLeft: '10%'
}

AnswerBlock.propTypes = {
  id: PropTypes.number,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  checked: PropTypes.bool,
  type: PropTypes.string
}
