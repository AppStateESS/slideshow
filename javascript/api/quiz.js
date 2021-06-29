// this import allows for async to be exportable, i believe
import "regenerator-runtime/runtime";

export const fetchQuiz = async (id) => {
    let quizContent = {}
    await $.ajax({
      url: './slideshow/Quiz/' + id,
      type: 'GET',
      dataType: 'json',
      success: async (data) => {
        // Convert array to object
        data = data[0]
        quizContent = {
          question: data['question'],
          answers: JSON.parse(data['answers']),
          correct: JSON.parse(data['correct']),
          type: data['type'],
          feedback: JSON.parse(data['feedback']),
          quizId: Number(data['id'])
        }
      },
      error: (req, res) => {
        console.error(res)
      }
    })
    return quizContent
}

export const saveQuiz = async (id, quizObject) => {
    let success = false
    await $.ajax({
        url: './slideshow/Quiz/' + id,
        type: 'put',
        data: quizObject,
        success: async (res) => {
            success = true
        },
        error: (req, res) => {
            console.log(req)
            console.error(res)
        }
})
    return success
}

export const postQuiz = async () => {
    let quizId = -1
    await $.ajax({
        url: './slideshow/Quiz/',
        method: 'post',
        data: {
          questionTile: 'this is a test title',
          type: 'open' 
        },
        success: (id) => {
          quizId = id
        },
        error: (req, res) => {
          console.log(res.toString())
        }
      })
      return Number(quizId)
}
