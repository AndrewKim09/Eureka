import React, { useEffect } from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faMinus, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons'
import{ FinalCheck }from './FinalCheck'

export const CreateQuiz = ({  setTitle, setDescription, title, description }) => {

  const [typeOfQuestion, setTypeOfQuestion] = useState("default")
  const [questionError, setQuestionError] = useState("")
  const [answerError, setAnswerError] = useState("")
  const [choices, setChoices] = useState(1)
  const [numberOfQuestions, setNumberOfQuestions] = useState(1)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [finishedCheck, setFinishedCheck] = useState(false)
  const [finalCheck, setFinalCheck] = useState(false)
  const [finalize, setFinalize] = useState(false)
  const [titleError, setTitleError] = useState("")


  const addChoice = () => {
    if (choices <= 6) {
      setChoices(choices + 1)
    }
  }

  const removeChoice = () => {
    if (choices > 1) {
      setChoices(choices - 1)
    }
  }

  const addQuestion = async () => {
    setFinishedCheck(false)
    const questionElement = document.getElementById("question")
    if (typeOfQuestion === "multipleChoice") {
      addMultipleChoiceQuestion()
    }
    if (typeOfQuestion === "fillInTheBlank") {
      addFillInTheBlankQuestion()
    }

    if (typeOfQuestion === "longAnswer") {
      addEssayQuestion()
    }
    else if (questionElement.value === "") {
      setQuestionError("Please enter a question")
      return
    }

    setLoading(false)



  }

  const addEssayQuestion = () => {
    console.log("hi")
    const typeOfQuestionSelectorElement = document.getElementById("typeOfQuestionSelector")
    const questionElement = document.getElementById("question")

    setQuestions([...questions, { question: questionElement.value, type: typeOfQuestion }])

    console.log(questions)

    setNumberOfQuestions(numberOfQuestions + 1)
    setChoices(1)
    setAnswerError("")
    setTypeOfQuestion("default")
    typeOfQuestionSelectorElement.value = "default"
    setFinishedCheck(true)
  }

  const addFillInTheBlankQuestion = () => {

    var fillInBlankEmpty = false;
    const typeOfQuestionSelectorElement = document.getElementById("typeOfQuestionSelector")
    const questionElement = document.getElementById("question")
    const choicesElement = document.getElementById("answers")
    const choicesElementChildren = Array.from(choicesElement.children)

    if (choicesElementChildren.length < 1) {
      setAnswerError("Please enter at least 1 answer")
      setFinalize(false)
      return
    }

    choicesElementChildren.forEach((element) => {
      console.log(element.children)
      if (element.children[1].value === "") {
        fillInBlankEmpty = true
      }
    })

    if (fillInBlankEmpty) {
      setFinalize(false)
      setAnswerError("Please fill in all answers")
      return
    }

    const fillInBlankArray = choicesElementChildren.map((element) => {
      return {
        value: element.children[1].value,
      }
    })



    setQuestions([...questions, { question: questionElement.value,  answers: fillInBlankArray, type: typeOfQuestion }])

    console.log(questions)

    setNumberOfQuestions(numberOfQuestions + 1)
    setAnswerError("")
    setChoices(1)
    setTypeOfQuestion("default")
    typeOfQuestionSelectorElement.value = "default"
    setFinishedCheck(true)
  }

  const addMultipleChoiceQuestion = () => {
    const questionElement = document.getElementById("question")
    const choicesElement = document.getElementById("answers")
    const choicesElementChildren = Array.from(choicesElement.children)
    const typeOfQuestionSelectorElement = document.getElementById("typeOfQuestionSelector")
    var answerCheck = false
    var emptyAnswerCheck = false

    if (choicesElementChildren.length < 2) {
      setFinalize(false)
      setAnswerError("Please enter at least 2 answers")
      return
    }

    choicesElementChildren.forEach((element) => {
      if (element.children[0].value === "") {
        emptyAnswerCheck = true
      }

      console.log(element.children[1].checked)

      if (element.children[1].checked) {
        answerCheck = true
      }
    })

    if (!answerCheck) {
      setFinalize(false)
      setAnswerError("Please select a correct answer")
      return
    }

    if (emptyAnswerCheck) {
      setFinalize(false)
      setAnswerError("Please fill in all answers")
      return
    }



    const choicesArray = choicesElementChildren.map((element) => {

      return {
        value: element.children[0].value,
        true: element.children[1].checked
      }
    });


    setQuestions([...questions, { question: questionElement.value, answers: choicesArray, type: typeOfQuestionSelectorElement.value }])
    console.log(questions)

    setNumberOfQuestions(numberOfQuestions + 1)
    setAnswerError("")
    setChoices(1)
    setTypeOfQuestion("default")
    typeOfQuestionSelectorElement.value = "default"
    setFinishedCheck(true)

  }

  const finishQuestions = () => {
    setLoading(true)
    setFinalize(true)
    if(title === ""){
      setTitleError("Please enter a title")
      setLoading(false)
      setFinalize(false)
      return;
    }
    
    addQuestion()
    setLoading(false)

  }

  useEffect(() => {
    if(finalize && finishedCheck){
      console.log("finished")
      console.log(questions)
      setFinalCheck(true)
    }
  }, [questions, finishedCheck])

  return (
    <div>
      {finalCheck? <FinalCheck questions = {questions} title = {title} description = {description}/> :
      <div>
    {loading? <div class="flex justify-center items-center h-screen"><p class="text-4xl">Loading...</p></div>
    :
    
      
      <div>
      <label for="title">
        <div>
          <p>Title</p> <p class="error">{titleError}</p>
        </div>
        <input id="title of quiz" class="border-solid border-black border-2" onChange={(event) => setTitle(event.target.value)} />
      </label>

      <label for="description">
        <div>
        </div>
        <textarea id="description" class="border-solid border-black border-2" cols="60" rows="5" onChange={(event) => setDescription(event.target.value)} />
      </label>

      <p class="font-bold text-lg">Questions</p>
      <fieldset>
        <label for="typeOfQuestion">
          <select id="typeOfQuestionSelector" class="border-solid border-black border-2" onChange={(event) => { setTypeOfQuestion(event.target.value) }}>
            <option value="default">Select a type of question</option>
            <option value="multipleChoice">Multiple Choice</option>
            <option value="fillInTheBlank">Fill in the blank(s)</option>
            <option value="longAnswer">Long Answer</option>
          </select>
        </label>

        <div class="flex">
          {typeOfQuestion === "default" ? <></> :
            <div class="flex">
              {typeOfQuestion === "multipleChoice" ?
                <div>
                  <button class=" text-red-400 h-6 mr-5 mt-5" type="none" onClick={() => { removeChoice() }}><FontAwesomeIcon icon={faMinus} /> Add Choice</button>
                  <button class=" text-blue-400 h-6 mr-5 mt-5" type="none" onClick={() => { addChoice() }}><FontAwesomeIcon icon={faPlus} /> Add Choice</button>
                </div>
                : <></>}

              {typeOfQuestion === "fillInTheBlank" ?
                <div>
                  <button class=" text-red-400 h-6 mr-5 mt-5" type="none" onClick={() => { removeChoice() }}><FontAwesomeIcon icon={faMinus} /> Remove FillBox</button>
                  <button class=" text-blue-400 h-6 mr-5 mt-5" type="none" onClick={() => { addChoice() }}><FontAwesomeIcon icon={faPlus} /> Add FillBox</button>
                </div>
                : <></>}

              <button class=" text-green-400 h-6 mr-5 mt-5" type="none" onClick={() => { addQuestion() }}><FontAwesomeIcon icon={faArrowRight} /> Next Question</button>
              <button class=" text-purple-400 h-6 mt-5" type="none" onClick={() => { finishQuestions() }}><FontAwesomeIcon icon={faUpload} /> Finish Questions</button>
            </div>
          }
        </div>

        {typeOfQuestion != "default" ?

        

          <fieldset>

            <label class="p-0" for="question">
              <p class="error">{questionError}</p>
              <p>Question</p>
              <textarea rows = {5} cols = {70} id="question" class="border-solid border-black border-2 min-h-[50px]" onChange={() => { setQuestionError("") }} />
            </label>


            <label for="answer" class="ml-5 py-2">
              <p class="error">{answerError}</p>

              {typeOfQuestion === "multipleChoice" ?
                /*---------------------Multiple Choice---------------------*/

                <div>
                  <p>Answers</p>

                  <label id="answers" class="ml-5 py-2">
                    {Array.from({ length: choices }, (_, index) => (
                      <div key={index} class="flex mb-2">
                        <input class="border-solid border-2 border-black mr-4" onChange={() => { setAnswerError("") }} />
                        <input type="checkbox" onChange={() => { setAnswerError("") }} />
                      </div>
                    ))}
                  </label>
                </div>


                :

                /*---------------------Fill in the blank---------------------*/
                <div>{typeOfQuestion == "fillInTheBlank" ?


                  <div>
                    <label id="answers" class="ml-5, py-2">
                      

                      {Array.from({ length: choices }, (_, index) => (
                        <div key={index} class="flex mb-2">
                          <p>blank {index}:</p>
                          <input class="border-solid border-2 border-black mr-4" />
                        </div>
                      ))}
                    </label>

                  </div>


                  :
                  // ---------------------Essay---------------------//
                  <div>
                  </div>
                }
                </div>

              }

            </label>

          </fieldset>


        : <></>}

      </fieldset>





    </div>
}
</div>}
</div>
  )
}
