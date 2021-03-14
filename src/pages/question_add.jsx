import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Submit } from '../components/buttons'
import { Images, Markup, Options, Result, Score } from '../components/displays'
import { Answer, Choices, Marks, Mode, Question, Solution } from '../components/question'
import { QUESTIONS, useFetch } from '../utilities/apis'
import { choiceLabel } from '../utilities/helpers'

const QuestionAdd = () => {
  const { post } = useFetch()
  const { state } = useLocation()

  const [ text, setText ] = useState('')
  const [ marks, setMarks ] = useState(1)
  const [ mode, setMode ] = useState(Mode.answer)
  const [ answer, setAnswer ] = useState('')
  const [ choices, setChoices ] = useState([])
  const [ images, setImages ] = useState([])
  const [ solution, setSolution ] = useState({...Solution.NODES})

  useEffect(() => {
    if (mode === Mode.answer) {
      setAnswer('')
      setChoices([])
    }
    
    if (mode === Mode.options) {
      setAnswer('')
      setChoices([{...Choices.NODES}, {...Choices.NODES}, {...Choices.NODES}, {...Choices.NODES}])
    }
  }, [ mode ])

  function invalid() {
    if (mode === Mode.answer && !answer) return true

    if (mode === Mode.options) {
      if (choices.some(choice => choice.text.trim() === '') && choices.some(choice => choice.image === '') || !choices.some(choice => choice.answer)) return true
    }
    
    return false
  }

  function onSubmit(event) {
    event.preventDefault()
    
    const data = { text, marks, answer, choices, solution, images, ...state }

    post(QUESTIONS + 'new', data, (error, _) => {
      if (error) {
        return console.log(error)
      }
      
      setText('')
      setMarks(1)
      setImages([])
      setMode(Mode.answer)
      setAnswer('')
      setSolution({...Solution.NODES})
    })
  }

  return (
    <>
      <div className="col h-100 overflow-auto">
        <h4 className="mb3">Add Question</h4>

        <form id="form" onSubmit={onSubmit}>
          <Question value={text} onChange={setText} onImages={setImages} />

          <Marks value={marks} onChange={setMarks} />

          <Mode value={mode} onChange={setMode} />

          {mode === Mode.answer && (
            <Answer value={answer} onChange={setAnswer} />
          )}

          {mode === Mode.options && (
            <Choices values={choices} onChange={setChoices} />
          )}

          <Solution value={solution} onChange={setSolution} />
        </form>
      </div>

      <div className="col h-100">
        <div className="border rounded p-3 h-100 overflow-auto">
          <Markup latex={text} className={images.length < 1 && choices.length < 1 && 'mb-0'} />

          {text && (
            <>
              <Images images={images} onChange={setImages} />

              <Options choices={choices} onChange={setChoices} />

              <hr />

              <Score marks={marks} label />

              {mode === 'answer' && (
                <Markup label="Correct Answer:" latex={answer} />
              )}

              {mode === 'options' && (
                choices.map((choice, index) => choice.answer && (
                  <p key={index}>Correct Answer: Choice {choiceLabel(index)}</p>
                ))
              )}

              <Result solution={solution} onChange={setSolution} />

              <div className="d-flex justify-content-center mt-3">
                <Submit width="75" form="form" disabled={invalid()} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

const QuestionAddPage = () => (
  <div className="container h-100 py-5">
    <div className="row h-100">
      <QuestionAdd />     
    </div>
  </div>
)
export default QuestionAddPage
