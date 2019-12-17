import React, { useState, useEffect } from 'react'

import Tippy from '@tippy.js/react'
import 'tippy.js/themes/light-border.css'

export const Navigation = (props) => {
    return (
        <div className="btn-toolbar" style={buttonGroup}>
            <div className="btn-group btn-group-lg">
                <button className="btn btn-primary" onClick={props.prev} disabled={props.prevDisable}><i className="fas fa-arrow-circle-left"></i></button>
                <button className="btn btn-primary" onClick={props.next} disabled={props.nextDisable}><i className="fas fa-arrow-circle-right"></i></button>
            </div>
        </div>
    )
}

export const NavButton = (props) => {
    let type = 'secondary';
    if (props.type != undefined) type = props.type;
    return (
        <div style={buttonGroup}>
            <button className={`btn btn-${type}`} style={{width: 100}} onClick={props.onClick}>{props.value}</button>
        </div>
    ); 
}

export const Finish = (props) => {
    let visible = true
    if (props.visible != undefined) visible = props.visible 
    if (!visible) return null
    return (
        <NavButton type="success" value="Finish" onClick={() => window.location.href = './slideshow/Show'}/>
    )

}

export const SlidesNav = (props) => {
    const [popover, setPopover] = useState(false)

    //useEffect(() => console.log(popover), [popover])

    function changeSlide(event) {
        
        const id = event.currentTarget.id
        if (id == 'high') {
            props.changeSlide(props.high)
        } else if (id === 'first') {
            props.changeSlide(0)
        }
        else {
            props.changeSlide(id-1)
        }
        setPopover(false)
    }

    let closeSlides = []
    for (let i = props.currentSlide - 2; i < props.currentSlide + 3; i++) {
        if (i < 0 || i > props.high || i > props.max) continue;    
        closeSlides.push(i+1);
    }
    const closeButtonG = closeSlides.map(i => {
        let type = (i-1 === props.currentSlide) ? 'primary' : 'secondary'
        return <button id={`${i}`} className={`btn btn-${type}`} key={i} onClick={changeSlide}>{i}</button>
    })
    const slidesCon = (
        <div style={{padding: 10}}>
            <p>Change Slide</p>
            <div className="btn-group">
                {closeButtonG}
            </div>
            <hr></hr>
            <p>Return to</p>
            <div className="row">
                <div className="col">
                <Tippy content={<div>First Slide</div>} arrow={true} placement={'bottom'}>
                    <button id="first" className="btn btn-secondary btn-block" onClick={changeSlide} style={{width: 100}}>First</button>
                </Tippy>
                </div>
                <div className="col">
                    <Tippy content={<div>Highest Completed Slide</div>} arrow={true} placement={'bottom'}>
                        <button id="high" className="btn btn-secondary btn-block" onClick={changeSlide} style={{width: 100}}>Highest</button>
                    </Tippy>
                </div>
            </div>
            <hr></hr>
            <button className="btn btn-danger btn-block" onClick={() => setPopover(false)}>Close</button>
        </div>
    )
    // One Tippy is onHover, the other is onClick
    return (
        <Tippy 
            content={slidesCon} 
            visible={popover} 
            interactive={true}
            theme={'light-border'}
            hideOnClick={false}>
            <Tippy content={<div>Change Slide</div>} arrow={true}>
                <span>
                    <NavButton key="slidesPrev" value={`Slide ${props.currentSlide+1}`} onClick={() => setPopover(true)} onBlur={() => setPopover(false)}/>
                </span>
            </Tippy>
        </Tippy>
    )
}

export const Progress = (props) => {
    return (
        <div className="progress" style={{marginBottom: '1rem'}}>
          <div className="progress-bar" 
               role="progressbar" 
               aria-valuemin="0" 
               aria-valuemax="100" 
               key={props.value}
               style={{width: props.value}}>
                 {props.value}
          </div>
        </div>
    )
}

const buttonGroup = {
    justifyContent: 'center', display: 'flex', marginBottom: '1rem'
}
