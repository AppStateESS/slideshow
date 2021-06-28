import React, {useState, useEffect} from 'react'

// Resources for loading from db
import {
  fetchShow,
  fetchSlides,
  fetchSession,
  updateSession,
  slidesResource,
} from '../api/present'

import {getPageId} from '../api/getPageId'

import PresentView from './PresentView'

import {Progress, Navigation, Finish, SlidesNav} from './Navbar'
import Skeleton from '../Resources/Components/Skeleton'
import PropTypes from 'prop-types'

import 'animate.css'

export default function Present({isAdmin}) {
  const [showTitle, setShowTitle] = useState('Present: ')
  const [showTimer, setShowTimer] = useState(0)
  const [showAnimation, setShowAnimation] = useState('None')

  const [content, setContent] = useState(slidesResource.content)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [highestSlide, setHighestSlide] = useState(0)

  const [prevDisable, setPrevDisable] = useState(true) // previous button disabled?
  const [nextDisable, setNextDisable] = useState(true) // next button disabled?

  const [loaded, setLoaded] = useState(false) // use to avoid running logic before db calls return
  const [finished, setFinished] = useState(false)
  const showId = getPageId()

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
    const high = state[2]
    setHighestSlide(high)
    //TODO: Update session with new highestSlide / currentSlide (maybe?)
    const finish = high == content.length - 1
    updateSession(window.sessionStorage.getItem('id'), high, finish)
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
        setFinished(final)
      }, showTimer)
    }
  }, [nextDisable])

  async function load() {
    const show = await fetchShow(showId)
    const content = await fetchSlides(showId)
    const session = await fetchSession(showId)

    let current = Number(session.highest)
    if (session.complete) {
      current = 0
    }
    setShowTitle(show.showTitle)
    setShowTimer(show.showTimer)
    setShowAnimation(show.animation)
    setContent(content)
    setCurrentSlide(current)
    setHighestSlide(Number(session.highest))
    setLoaded(true)
    setFinished(session.complete)

    setNextDisable(!session.complete)
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
    const visited = currentSlide < highestSlide
    if (finished || visited) {
      next = false
    }

    // Final global check that will exist despite finished
    if (currentSlide == 0) {
      // First slide
      prev = true
    } else if (currentSlide == content.length - 1) {
      // Last slide
      next = true
    }
    return [prev, next, high]
  }

  function validate() {
    // This will be called from subcompents to revalidate the current component
    let final = false
    if (currentSlide === content.length - 1) final = true
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
      {isAdmin ? (
        <a
          className="btn btn-success float-right"
          href={`./slideshow/Slide/Edit/${showId}`}>
          Edit
        </a>
      ) : null}
      <h2>{showTitle}</h2>
      <br></br>
      <div
        key={currentSlide}
        className={`animated ${showAnimation} faster`}
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          justifyContent: 'center',
          display: 'flex',
        }}>
        <PresentView
          currentSlide={currentSlide}
          high={highestSlide}
          content={content[currentSlide]}
          validate={validate}
          finished={finished}
        />
      </div>
      <Progress
        value={
          String(Math.round(((highestSlide + 1) / content.length) * 100)) + '%'
        }
      />
      <SlidesNav
        currentSlide={currentSlide}
        max={content.length}
        high={highestSlide}
        changeSlide={(slide) => setCurrentSlide(slide)}
      />
      <Navigation
        next={_next}
        prev={_prev}
        nextDisable={nextDisable}
        prevDisable={prevDisable}
      />
      <Finish visible={finished} />
    </div>
  )
}

Present.propTypes = {
  isAdmin: PropTypes.string,
}
