import React, {Component} from 'react'
import Overlay from '../AddOn/Html/Overlay.jsx'

export default class ShowList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showForm : false
    }
    this.showForm = this.showForm.bind(this)
    this.hideForm = this.hideForm.bind(this)
  }

  showForm() {
    this.setState({showForm:true})
  }

  hideForm() {
    this.setState({showForm:false})
  }

  overlay() {
    if (!this.state.showForm) {
      return
    } else {
      return <Overlay title="Create new show" close={this.hideForm}>hi</Overlay>
    }
  }

  render() {
    return (
      <div>
        {this.overlay()}
        <button className="btn btn-primary" onClick={this.showForm}>Create new show</button>
      </div>
    )
  }
}
