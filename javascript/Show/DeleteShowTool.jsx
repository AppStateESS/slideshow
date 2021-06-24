import React, {useState, forwardRef} from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/themes/light-border.css'

export default function DeleteShowTool(props) {
  const [deleteAlert, setDeleteAlert] = useState(false)

  return (
    <Tippy
      content={
        <span>
          <div style={{padding: 20, width: 300}}>
            <button
              className="btn btn-danger btn-block"
              onClick={() => props.delete()}>
              Delete Show
            </button>
            <button
              className="btn btn-secondary btn-block"
              onClick={() => setDeleteAlert(false)}>
              Cancel
            </button>
          </div>
        </span>
      }
      visible={deleteAlert}
      interactive={true}>
      <Tippy content={<div>Delete this show</div>} arrow={true}>
        <button className="tool trash" onClick={() => setDeleteAlert(true)}>
          <i className="fas fa-trash"></i>
        </button>
      </Tippy>
    </Tippy>
  )
}
