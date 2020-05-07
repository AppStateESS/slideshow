import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import Tippy from '@tippy.js/react'
import {CirclePicker, SketchPicker} from 'react-color'

export default function ColorSelect(props) {
    const [pickerColor, setPickerColor] = useState(false) // Allows for the picker to maintain the current color

    function handleColorChange(color) {
        setPickerColor(color.hex)
        props.changeBackground(color.hex)
    }
    
    return (
        <Row flex="space-between"> 
              <Col>
                    <h6>Color</h6>
                </Col>
                <Col>
                    <CirclePicker
                        colors = {["#CD6155", "#EC7063", "#AF7AC5", "#A569BD", "#5499C7", "#5DADE2", "#48C9B0", "#45B39D",
                        "#52BE80", "#58D68D", "#F4D03F", "#F5B041", "#FAD7A0", "#EB984E", "#DC7633", "#AAB7B8", "#CACFD2", "#E5E7E9"]}
                        onChangeComplete={handleColorChange}
                    />
                </Col>
                <Col>
                  <Tippy
                    content={<SketchPicker
                                color={pickerColor}
                                onChangeComplete={handleColorChange}/>} 
                    arrow
                    interactive
                  >
                     <button className="btn btn-primary">
                       Advanced Color
                      </button>
                    </Tippy>
                </Col>
        </Row>
    )
}