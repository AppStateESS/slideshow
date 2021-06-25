import React from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/themes/light-border.css'
import PropTypes from 'prop-types'
SessionTool.propTypes = {
  sessionTransition: PropTypes.func,
}

export default function SessionTool(props) {
  return (
    <Tippy
      theme="light-border"
      content={<div>View user progress</div>}
      arrow={true}>
      <button className="tool" onClick={props.sessionTransition}>
        <i className="fas fa-users"></i>
      </button>
    </Tippy>
  )
}
