import React, { useState } from 'react'
import { Row, Col} from 'react-bootstrap'
import Tippy from '@tippy.js/react'

export default function ColorSelect(props) {
    const [displayPicker, setDisplayPicker] = useState(false)
    const [pickerHover, setPickerHover] = useState(false)

    function handleColorChange(color) {
        this.props.saveBackground(color.hex)
    }

    function handleSketchPicker() {

    }
    
    let colorPickStyle = (pickerHover) ? {borderColor: props.currentColor} : {color: props.currentColor}
    
    return (
        <Row>
              <Col sm={6} className="settings-options">
                Background Color
              </Col>
              <Col sm={4}>
                <CirclePicker
                  colors = {["#CD6155", "#EC7063", "#AF7AC5", "#A569BD", "#5499C7", "#5DADE2", "#48C9B0", "#45B39D",
                   "#52BE80", "#58D68D", "#F4D03F", "#F5B041", "#FAD7A0", "#EB984E", "#DC7633", "#AAB7B8", "#CACFD2", "#E5E7E9"]}
                  onChangeComplete={handleColorChange}
                />
                </Col>
                <Col sm={2}>
                  <a onMouseOver={() => setPickerHover(true)} onMouseLeave={() => setPickerHover(false)}>
                  <Tippy
                  content={<div>Click to enter custom color</div>} arrow>
                     <button
                     className="ColorPicker"
                     style={colorPickStyle}
                     onClick={() => setDisplayPicker(!displayPicker)}><i className="fas fa-palette" style={{color: '#292b2c'}}></i></button>
                    </Tippy>
                    </a>
                    <div className="SketchPicker">
                      <SketchPicker
                      color={props.currentColor}
                      onChangeComplete={handleColorChange}
                      />
                    </div>
                </Col>
        </Row>
    )
}