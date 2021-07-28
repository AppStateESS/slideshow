import 'regenerator-runtime/runtime'
import {fetchQuiz} from './quiz'

/* global $ */
export const fetchSlides = async (showId) => {
  let loaded = await $.ajax({
    url: './slideshow/Slide/present/?id=' + showId,
    type: 'GET',
    dataType: 'json',
    success: async function (data) {
      let loaded = data['slides']
      return loaded
    },
    error: function () {
      alert('Failed to load data.')
    },
  })
  return await parseSlides(loaded)
}

export const fetchShow = async (showId) => {
  const result = await $.ajax({
    url: './slideshow/Show/present/?id=' + showId,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      if (data.length > 0) {
        let time = Number(data[0].slideTimer) * 1000
        let show = {}
        show.showTimer = time
        show.showTitle = data[0].title
        show.animation = data[0].animation
      }
    },
  })
  return result
}

export const fetchSession = async (showId) => {
  const loaded = await $.ajax({
    url: './slideshow/Session/' + showId,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      return data
    },
  })
  return parseSession(loaded)
}

export const updateSession = (showId, highestSlide, finished) => {
  /* Updates the db that saves the users location within the slideshow */
  $.ajax({
    url: './slideshow/Session/' + showId,
    type: 'PUT',
    data: {highestSlide: Number(highestSlide), completed: finished},
    dataType: 'json',
    success: function () {
      //console.log("session updated successfully")
    }.bind(this),
  })
}

function parseBool(flag) {
  if (typeof flag === 'string') {
    return flag === '0' || flag === 'false' ? false : true
  } else if (typeof flag === 'number') {
    return flag != 0
  } else {
    return typeof flag === 'boolean' ? flag : JSON.parse(flag)
  }
}

const parseSlides = async (loaded) => {
  loaded = loaded.slides
  let showContent = []
  for (let i = 0; i < loaded.length; i++) {
    let saveC = undefined
    let quizC = undefined
    let isQ = parseBool(loaded[i].isQuiz)
    if (!isQ) {
      saveC = loaded[i].content
    } else {
      quizC = await fetchQuiz(loaded[i].quizId)
      //quizC = undefined
    }
    showContent.push({
      isQuiz: isQ,
      saveContent: saveC,
      quizContent: quizC,
      background: loaded[i].background,
      media: JSON.parse(loaded[i].media || '{}'),
    })
  }
  return showContent
}

const parseSession = (data) => {
  let sessionState = {highest: 0, complete: false}
  // Data is present and an object. Data will return true if logged in as an admin
  if (data != null && typeof data == 'object') {
    sessionState.highest = parseInt(data.highestSlide)
    sessionState.complete = parseBool(data.completed)
  }
  return sessionState
}

export const slidesResource = {
  content: {
    saveContent: undefined,
    quizContent: undefined,
    isQuiz: false,
    background: '#E5E7E9',
    media: {imgUrl: '', align: ''},
    slideId: 0,
    thumb: undefined,
  },
}
