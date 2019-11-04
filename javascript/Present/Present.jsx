import React, { useState, useEffect } from 'react'

// Resources for loading from db
import { fetchShow, fetchSlides, fetchSession, slidesResource } from '../api/slideshow'

import PresentView from './PresentView'

import { Progress, Navigation, Skeleton, Finish, SlidesNav } from './Navbar'

export default function Present() {
    
    const [showTitle, setShowTitle] = useState('Present: ')
    const [showTimer, setShowTimer] = useState(0)

    const [content, setContent] = useState(slidesResource.content)

    const [currentSlide, setCurrentSlide] = useState(0)
    const [highestSlide, setHighestSlide] = useState(0)

    const [prevDisable, setPrevDisable] = useState(true) // previous button disabled?
    const [nextDisable, setNextDisable] = useState(true) // next button disabled?

    const [loaded, setLoaded] = useState(false) // use to avoid running logic before db calls return
    const [finalValidate, setFinalValidate] = useState(false) // used if last slide is quiz

    /** Component did mount */
    useEffect(() => {
        load()
    }, [])

    useEffect(() => {
        // "Touple" as array of the values
        // of [prevDisable, nextDisable, highestSlide]
        const state = evaluateState()
        setNextDisable(state[1])
        setPrevDisable(state[0])
        setHighestSlide(state[2])
        //TODO: Update session with new highestSlide / currentSlide (maybe?)
    }, [currentSlide])

    useEffect(() => {
        // This will run before the data loads from db this eliminates that run
        if (!loaded) return
        const visited = currentSlide < highestSlide
        const isQuiz = content[currentSlide].isQuiz
        const final = currentSlide === content.length - 1 
        if (nextDisable && loaded && !visited && !isQuiz) {
            window.setTimeout(() => {
                setNextDisable(final)
                setFinalValidate(final)
            }, showTimer)
        }
    }, [nextDisable])

    async function load() {
        const showId = window.sessionStorage.getItem('id')
        const show = await fetchShow(showId)
        const content = await fetchSlides(showId)
        const session = await fetchSession(showId)

        let current = Number(session.highest)
        if (session.complete) {
            current = 0
        }
        
        setShowTitle(show.showTitle)
        setShowTimer(show.showTimer)
        setContent(content)
        setCurrentSlide(current)
        setHighestSlide(Number(session.highest))
        setLoaded(true)

        let disable = (session.highest != content.length - 1)
        setNextDisable(disable)
        window.setTimeout(() => {
            setNextDisable(false)
        }, show.showTimer)
    }

    function evaluateState() {
        // Handle behavior for next and prev disables
        let next = true
        let prev = false
        let high = highestSlide
        if (high < currentSlide) high = currentSlide
        const finished = (highestSlide == content.length-1)
        const visited = (currentSlide < highestSlide)
        if (finished || visited) {
            next = false
        }

        // Final global check that will exist despite finished
        if (currentSlide == 0) {
            // First slide
            prev = true
        } 
        else if (currentSlide == content.length - 1) {
            // Last slide
            next = true
        }
        return [prev, next, high]
    }

    function validate() {
        // This will be called from subcompents to revalidate the current component
        let final = false
        if (currentSlide === content.length - 1) final = true
        setFinalValidate(final)
        setNextDisable(final)
        
    }

    function _next() {
        let next = currentSlide + 1
        if (next == content.length) next = currentSlide // set disable
        setCurrentSlide(next) 
    }

    function _prev() {
        let prev = currentSlide - 1 
        if (prev < 0) prev = 0 // set state to disable
        setCurrentSlide(prev) 
    }
    if (!loaded) return <Skeleton />
    return (
    <div>
        <h1 style={{textDecorationLine: 'underline'}}>{showTitle}</h1>
        <br></br>
        <div style={{marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center', display: 'flex'}}>
          <PresentView
            currentSlide={currentSlide}
            high={highestSlide}
            content={content[currentSlide]}
            validate={validate}
            />
        </div>
        <Progress value={String(Math.round(((highestSlide+1)/content.length) * 100)) + '%'} />
        <SlidesNav currentSlide={currentSlide} max={content.length} high={highestSlide} changeSlide={(slide) => setCurrentSlide(slide)}/>
        <Navigation next={_next} prev={_prev} nextDisable={nextDisable} prevDisable={prevDisable}/>
        <Finish visible={finalValidate} />
    </div>
    )
}


