/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Answer {
  constructor (newAnswerText) {
    this.answerText = newAnswerText
    this.answerScore = 0
  }
		/*Set the answer score
		*/ 
  setAnswerScore (newScore) {
    this.answerScore = newScore
  }
		/*Calculate the score
		*/ 
  reduceAnswerScore (number) {
    this.answerScore -= number
    return this.answerScore = (this.answerScore < 0) ? 0 : this.answerScore
        //  let eventInput = new Event('scoreUpdateEvent')
      //  window.dispatchEvent(eventInput)
  }
}
