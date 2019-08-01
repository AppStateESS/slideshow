import React from 'react'
import Tippy from '@tippy.js/react'

export default function SessionTool(props) {

  return (
    <Tippy
      content={<div>View user progress</div>}
      arrow={true}
    >
      <button className="tool" onClick={props.sessionTransition}><i className="fas fa-users"></i></button>
    </Tippy>
  )
}