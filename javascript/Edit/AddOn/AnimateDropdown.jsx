import React, {useState, useEffect} from 'react'
import {Dropdown} from 'react-bootstrap'

export default function AnimateDropdown(props) {
    function setAnimation(a) {
        $.ajax({
            url: './slideshow/Show/' + props.id,
            type: 'PATCH',
            dataType: 'json',
            data: {animation: a},
            success: () => console.log("animation changed to ", a),
            error: (req, res) => console.log(res) 
        })
        props.setAnimation(a)
    }

    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {props.animation}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => setAnimation('None')}>None</Dropdown.Item>
                <Dropdown.Item onClick={() => setAnimation('slideInRight')}>slideInRight</Dropdown.Item>
                <Dropdown.Item onClick={() => setAnimation('slideInLeft')}>slideInLeft</Dropdown.Item>
                <Dropdown.Item onClick={() => setAnimation('bounceInRight')}>bounceInRight</Dropdown.Item>
                <Dropdown.Item onClick={() => setAnimation('bounceInLeft')}>bounceInLeft</Dropdown.Item>
                <Dropdown.Item onClick={() => setAnimation('zoomIn')}>zoomIn</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}