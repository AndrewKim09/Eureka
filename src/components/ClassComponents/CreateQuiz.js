import React, { useEffect } from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faMinus, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons'
import { set } from 'react-hook-form'

export const CreateQuiz = ({titleError, setTitle, descriptionError, setDescription}) => {

    const [typeOfQuestion, setTypeOfQuestion] = useState("default")
    const [questionError, setQuestionError] = useState("")
    const [answerError, setAnswerError] = useState("")
    const [choices, setChoices] = useState(1)
    const [numberOfQuestions, setNumberOfQuestions] = useState(1)
    const [questions, setQuestions] = useState([])


    const addChoice = () => {
      if(choices <= 6){
        setChoices(choices + 1)
      }
    }

    const removeChoice = () => {
        if(choices > 1){
            setChoices(choices - 1)
        }
    }   

    const addQuestion =  () => {
      const questionElement = document.getElementById("question")
      const choicesElement = document.getElementById("answers")
      const choicesElementChildren = Array.from(choicesElement.children)
      const typeOfQuestionSelectorElement = document.getElementById("typeOfQuestionSelector")
      var answerCheck = false
      var emptyAnswerCheck = false

      if(questionElement.value === ""){
        console.log("c")
        setQuestionError("Please enter a question")
        return
      }

      if(choicesElementChildren.length < 2){
        console.log("d")
        setAnswerError("Please enter at least 2 answers")
        return
      }

      choicesElementChildren.forEach((element) => {
        if(element.children[0].value === ""){
          emptyAnswerCheck = true
        }

        console.log(element.children[1].checked)

        if(element.children[1].checked){
          answerCheck = true
        }
      })

      if(!answerCheck){
        console.log("a")
        setAnswerError("Please select a correct answer")
        return
      }

      if(emptyAnswerCheck){
        console.log("b")
        setAnswerError("Please fill in all answers")
        return
      }

    

      const choicesArray = choicesElementChildren.map((element) => {
        
        return{
          value: element.children[0].value,
          true: element.children[1].checked
        }
      });


        setQuestions([...questions, {question: questionElement.value, answers: choicesArray, type: typeOfQuestionSelectorElement.value}])
        console.log(questions)
        
          setNumberOfQuestions(numberOfQuestions + 1)
          setChoices(1)
          setTypeOfQuestion("default")
          typeOfQuestionSelectorElement.value = "default"

    }

    

      


  return (
    <div>
                        <label for = "title">
                          <div>
                            <p>Title</p> <p class = "error">{titleError}</p>
                          </div>
                          <input id = "title of quiz" class = "border-solid border-black border-2" onChange={(event) => setTitle(event.target.value)}/>
                        </label>
                      
                        <label for = "description">
                          <div>
                            <p>Description</p> <p class = "error">{descriptionError}</p>
                          </div>
                          <textarea id = "description" class = "border-solid border-black border-2" cols = "60" rows = "5" onChange={(event) => setDescription(event.target.value)}/>
                        </label>

                        <p class = "font-bold text-lg">Questions</p>
                        <fieldset>
                          <label for = "typeOfQuestion">
                            <select id = "typeOfQuestionSelector" class = "border-solid border-black border-2" onChange = {(event) => {setTypeOfQuestion(event.target.value)}}>
                              <option value = "default">Select a type of question</option>
                              <option value = "multipleChoice">Multiple Choice</option>
                              <option value = "shortAnswer">Short Answer</option>
                              <option value = "essay">Essay</option>
                            </select>
                          </label>

                          {typeOfQuestion === "multipleChoice" ? 
                            /*---------------------Multiple Choice---------------------*/
                            <fieldset>
                                <div class = "flex">
                                    
                                    <label class = "p-0"for = "question">
                                      <p class = "error">{questionError}</p>
                                        <p>Question</p>
                                        <input id = "question" class = "border-solid border-black border-2" onChange={() => {setQuestionError("")}}/>
                                    </label>
                                    <button class = " text-red-400 h-6 mr-5 mt-14" type = "none" onClick={() => {removeChoice()}}><FontAwesomeIcon icon = {faMinus}/> Add Choice</button>
                                    <button class = " text-blue-400 h-6 mr-5 mt-14"  type = "none" onClick={() => {addChoice()}}><FontAwesomeIcon icon = {faPlus}/> Add Choice</button>
                                    <button class = " text-green-400 h-6 mr-5 mt-14" type = "none" onClick = {() => {addQuestion()}}><FontAwesomeIcon icon = {faArrowRight}/> Next Question</button>
                                    <button class = " text-purple-400 h-6 mt-14" type = "none" onClick = {() => {addQuestion()}}><FontAwesomeIcon icon = {faUpload}/> Finish Questions</button>
                                </div>

                                
                                <label for = "answer" class = "ml-5 py-2">
                                  <p class = "error">{answerError}</p>
                                  <p>Answers</p>

                                  <label id = "answers" class = "ml-5 py-2">
                                    {Array.from({ length: choices }, (_, index) => (
                                      <div key = {index} class = "flex mb-2">
                                        <input class = "border-solid border-2 border-black mr-4" onChange={() => {setAnswerError("")}}/>
                                        <input type = "checkbox" onChange={() => {setAnswerError("")}}/>
                                      </div>
                                    ))}
                                  </label>

                                </label>

                                


                            
                            
                            </fieldset>
                            
                            
                            : 
                        
                            /*---------------------Short Answer & Long answer---------------------*/
                            <></>}


                        </fieldset>

                        

                        

                      </div>

  )
}
