import "regenerator-runtime/runtime";
const FetchQuiz = async function fetchQuiz(id) {
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
          answerFeedback: JSON.parse(data['answerFeedback']),
          quizId: Number(data['id'])
        }
      },
      error: (req, res) => {
        console.error(res)
      }
    })
    return quizContent
  }

export default FetchQuiz