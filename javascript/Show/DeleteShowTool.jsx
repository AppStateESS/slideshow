import React, {useState} from 'react'
import PropTypes from 'prop-types'
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
      <Tippy
        theme="light-border"
        content={<div>Delete this show</div>}
        arrow={false}>
        <button className="tool trash" onClick={() => setDeleteAlert(true)}>
          <i className="fas fa-trash"></i>
        </button>
      </Tippy>
    </Tippy>
  )
}

DeleteShowTool.propTypes = {
  delete: PropTypes.func,
}
