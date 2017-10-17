/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Quiz {
    /**
     * The constructor function
     * @param  {Object} xml The XML file Object
     */
  constructor (xml) {
    this.xml = xml // The config.xml file
    this.quiz = [] // [{question: "label", answers: [Answer1, Answer2...],}...]
    this.passingScore = 0 // The passingScore in the xml file
    this.score = 0 // The score that shows in the top of the screen
    this.incorrectWeight = 0 // For calculating the score
    this.labels = [] // [{labelX:"",labelY:""}]
    this.inputType = '' // The inputType in the xml file, it can be "drag" or other type like input
    this.checkTime = 0
    this.setUp()
  }
    /**
    * Build up the quiz
    */
  setUp () {
        // Create Quiz elements
    this.createQuiz()
        // Set the passing score
    this.setPassingScore()
        // Set the answerscore base on the number of the answer cards
    this.setAnswerScore()
        // Set the weight of answer for calculating the final score
   // this.setIncorrectWeight()
  }
    /**
     * Get the quiz type
     * @return {String} Returns "drag" or "input" type
     */
  getQuizType () {
    return this.xml.getElementsByTagName('match')[0].attributes.getNamedItem('inputtype').value
  }
    /**
     * Build up the quiz by xml parameters.
     *
     */
  createQuiz () {
            // Get question list
    let questions = this.xml.getElementsByTagName('question')
          // Loop the question list to get "labely", "labelX", "tagetX", "tagetY" to set the location of labels and tagetPoints
    Array.from(questions).forEach(question => {
      let labelY = question.attributes.getNamedItem('labely').value
      let labelX = question.attributes.getNamedItem('labelx').value
      let labelEntry = {
        labelY: labelY,
        labelX: labelX
      }

      this.labels.push(labelEntry)
    })

    let boxes = this.xml.getElementsByTagName('pair')
    Array.from(boxes).forEach(aBox => {
      let label = aBox.getElementsByTagName('question')[0].innerHTML
      let targetX = aBox.attributes.getNamedItem('targetx').value
      let targetY = aBox.attributes.getNamedItem('targety').value
      let contentsXml = aBox.getElementsByTagName('answer')
      let contents = Array.from(contentsXml).map(element => element.innerHTML)

      let answers = []
      contents.forEach(aContent => {
        let newAnswer = new Answer(aContent)
        answers.push(newAnswer)
      })

      let questionAnswerSet = {
        question: label,
        answers: answers,
        targetX: targetX,
        targetY: targetY
      }
      this.quiz.push(questionAnswerSet)
    })
  }
    /**
     * Setting the passing score of quiz
     */
  setPassingScore () {
    let passingScore = this.xml.getElementsByTagName('passing-score')[0]
    if (passingScore) {
      this.passingScore = Number(passingScore.innerHTML)
    }
  }
    /**
     * Call back function for each answer
     */
  forAllAnswers (callback) {
    this.quiz.forEach(questionAnswerSet => {
      questionAnswerSet.answers.forEach(answer => {
        callback(answer)
      })
    })
  }
    /**
     * Get the length of the quiz
     * @return {Number} Returns the numbers of questions
     */
  // countQuestions () {
  //   return this.quiz.length
  // }
    /**
     * Count the number of answers
     * @return {Number} Returns the number of answers
     */
  countAnswers () {
    return this.quiz.reduce((acc, cur) => acc + cur.answers.length, 0)
  }
    /**
     * Calculating the score for each answer
     * @return {Number} Returns the score for each question
     */
  calcAnswerScore () {
    let answerScore = 100 / this.countAnswers()
    return answerScore
  }
    /**
     * Calculating the incorrectWeigth of answer
     * @return {Number} Returns the incorrect weight for each answer
     */
  // calcIncorrectWeight () {
  //   let answerScore = this.calcAnswerScore()
  //   let incorrectWeight = answerScore * (1 / (this.countQuestions() - 1))
  //   return incorrectWeight
  // }
    /**
     * Set the score for each answer
     */
  setAnswerScore () {
    let answerScore = this.calcAnswerScore()
    this.forAllAnswers(answer => {
      answer.setAnswerScore(answerScore)
    })
  }
    /**
     * Reduce the Score when users get wrong answers
     */
  reduceAnswerScore () {
        // this.score -= answer.reduceAnswerScore(this.incorrectWeight)
    this.score = this.score - this.calcIncorrectWeight() * this.calcAnswerScore()
    this.score = (this.score <= 0) ? 0 : this.score
    let eventInput = new Event('scoreUpdateEvent')
    window.dispatchEvent(eventInput)
  }
    /**
     * Set the incorrectWeight by calling the calcIncorrectWeight function
     *
     */
  // setIncorrectWeight () {
  //   this.incorrectWeight = this.calcIncorrectWeight()
  // }
    /**
     * Adding up the updating score event
     * @param {Number} answer The answer objec
     */
  addQuizScore (answer) {
    let answerRate = answer.incorrectAnswerTime >= 4 ? 0 : (1 - answer.incorrectAnswerTime * 0.25)
    this.score += answer.answerScore * (answerRate)
    let eventInput = new Event('scoreUpdateEvent')
    window.dispatchEvent(eventInput)
  }
    /**
     * Make the score to integer
     * @return {Number} Get the socer from each round
     */
  getRoundedQuizScore () {
    return Math.round(this.score)
  }
    /**
     * Get the reduced score by accounting check times
     * @return {Number} Returns the times of clicking check button
     */
  checkTimeScore () {
        // let checkTime = Controller.myQuiz.checkTime

    return this.checkTime * this.incorrectWeight * this.calcAnswerScore()
  }
    /**
     * Calculating score in the "input Type"
     */
  calculateResultInputScore () {
    let questions = this.quiz.map(questionAnswerSet => questionAnswerSet)
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i].question.trim().toLowerCase()
      let answerObj = document.getElementById(question).childNodes[0]
      let answer = answerObj.innerText.trim().toLowerCase()
      if (question != answer) {

      } else {
        this.score += this.calcAnswerScore()
      }
    }
    this.score -= this.checkTimeScore()
    this.score = (this.score <= 0) ? 0 : this.score
  }
    /**
     * Find the answer
     * @param {String} innerHTML The text content of answer
     * @return {Answer} Returns the found answer
     */
  findAnswer (innerHTML) {
    let foundAnswer
    this.forAllAnswers(answer => {
      let p = document.createElement('p')
      p.innerHTML = answer.answerText
      if (p.innerHTML == innerHTML) {
        foundAnswer = answer
      }
    })
    return foundAnswer
  }
}
