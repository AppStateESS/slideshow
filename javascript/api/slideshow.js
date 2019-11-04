import "regenerator-runtime/runtime";
import FetchQuiz from './FetchQuiz'

export const fetchSlides = async (showId) => {
    let loaded = await $.ajax({
        url: './slideshow/Slide/present/?id=' + showId,
        type: 'GET',
        dataType: 'json',
        success: async function (data) {
          let loaded = data['slides']
          return loaded
        },
        error: function(req, err) {
          alert("Failed to load data.")
          console.error(req, err.toString());
        }
      });
    return await parseSlides(loaded)
}

export const fetchShow = async (showId) => {
    let show = {
        showTimer: 0,
        showTitle: 'Present: '
    }
    await $.ajax({
        url: './slideshow/Show/present/?id=' + showId,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
          let time = Number(data[0].slideTimer) * 1000
          show.showTimer = time
          show.showTitle = data[0].title
        },
        error: (req, res) => {
          console.error(req, res.toString())
        }
      })
      return show
}

export const fetchSession = async (showId) => {
    const loaded = await $.ajax({
      url: './slideshow/Session/' + showId,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        return data
      },
      error: (req, err) => {
        console.log("Failed to load session from db. This could be due to being logged in as an admin")
        //console.error(req, err.toString())
      }
    })
    return parseSession(loaded)
}

  function parseBool(flag) {
      if (typeof(flag) === 'string') {
        return (flag === '0' || flag === 'false') ? false : true
      }
      else if (typeof(flag) === 'number') {
        return (flag != 0)
      }
      else {
        return typeof(flag) === 'boolean' ? flag : JSON.parse(flag)
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
            quizC = await FetchQuiz(loaded[i].quizId)
            //quizC = undefined
        }
        showContent.push({
            isQuiz: isQ,
            saveContent: saveC,
            quizContent: quizC,
            backgroundColor: loaded[i].backgroundColor,
            media: JSON.parse(loaded[i].media || '{}'),
        })
    }
    return showContent
  }

  const parseSession = (data) => {
    data = data[0]
    let sessionState = {highest: 0, complete: 0}
    console.log(data)
    if (data != null) {
        sessionState.highest = parseInt(data.highestSlide)
        sessionState.complete = parseInt(data.completed)
    }
    return sessionState
  }

  export const slidesResource = {
    content: {
        saveContent: undefined,
        quizContent: undefined,
        isQuiz: false,
        backgroundColor: '#E5E7E9',
        media: {imgUrl: '', align: ''},
        slideId: 0,
        thumb: undefined
    }
  }