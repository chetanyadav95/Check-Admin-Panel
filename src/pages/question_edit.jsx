import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Submit } from '../components/buttons'
import { Fetch, Images, Markup, Options, Result, Score } from '../components/displays'
import { Select } from '../components/inputs'
import { Answer, Choices, Marks, Mode, Question, Solution } from '../components/question'
import { useDepartments } from '../store/application'
import { QUESTIONS, useFetch } from '../utilities/apis'
import { Type } from '../utilities/constants'
import { choiceLabel, years } from '../utilities/helpers'

const QuestionEdit = () => {
  const { update } = useFetch()
  const { state } = useLocation()
  const { goBack } = useHistory()

  const departments = useDepartments()

  const [ text, setText ] = useState('')
  const [ marks, setMarks ] = useState(1)
  const [ mode, setMode ] = useState(Mode.answer)
  const [ answer, setAnswer ] = useState('')
  const [ choices, setChoices ] = useState([])
  const [ images, setImages ] = useState([])
  const [ solution, setSolution ] = useState({...Solution.NODES})
  const [ department, setDepartment ] = useState('')
  const [ subject, setSubject ] = useState('')
  const [ year, setYear ] = useState('')
  const [ set, setSet ] = useState('')

  const selectedDepartment = departments.filter(result => result.code === department)[0]

  function setQuestion(value) {
    setText(value.text)
    setMarks(value.marks)

    if (value.answer) {
      setMode(Mode.answer)
    } else {
      setMode(Mode.options)
    }

    setAnswer(value.answer)
    setChoices(value.choices)
    setImages(value.images)
    setSolution(value.solution)
    setDepartment(value.department)
    setSubject(value.subject)
    setYear(value.year.toString())
    
    if (value.set) {
      setSet(value.set.toString())
    }
  }

  function invalid() {
    if (mode === Mode.answer && !answer) return true

    if (mode === Mode.options) {
      if (choices.some(choice => choice.text.trim() === '') && choices.some(choice => choice.image === '') || !choices.some(choice => choice.answer)) return true
    }
    
    return false
  }

  function onSubmit(event) {
    event.preventDefault()

    const data = { text, marks, answer, choices, solution, images, department, subject, year, set }

    update(QUESTIONS + `update/?id=${state.id}`, data, (error, _) => {
      if (error) return
      goBack()
    })
  }

  return (
    <Fetch url={QUESTIONS + `?id=${state.id}`} onFetch={setQuestion}>
      <div className="col h-100 overflow-auto">
        <h4 className="mb3">Edit Question</h4>

        <form id="form" onSubmit={onSubmit}>
          <Question value={text} onChange={setText} onImages={setImages} />

          <Marks value={marks} onChange={setMarks} />

          {mode === Mode.answer && (
            <>
              <label className="form-label">Answer</label>

              <Answer value={answer} onChange={setAnswer} />
            </>
          )}

          {mode === Mode.options && (
            <>
              <label className="form-label">Options</label>
              
              <Choices values={choices} onChange={setChoices} />
            </>
          )}

          <Solution value={solution} onChange={setSolution} />

          <hr />

          <Select label="Department" value={department} onChange={setDepartment}>
            {departments.map(department => (
              <option key={department.code} value={department.code}>
                {department.title}
              </option>
            ))}
          </Select>

          <Select label="Subject" value={subject} onChange={setSubject}>
            {selectedDepartment && selectedDepartment.subjects.map(subject => (
              <option key={subject.code} value={subject.code}>
                {subject.title}
              </option>
            ))}
          </Select>

          <Select label="Year" value={year} onChange={setYear}>
            <option value={Type.SERIES}>Test Series</option>
            <option value={Type.QUIZ}>Quiz</option>
            
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>

          {(year !== Type.SERIES || year !== Type.QUIZ) && (
            <Select label="Set" value={set} onChange={setSet}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </Select>
          )}
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

              {department && subject && year && (
                <div className="d-flex justify-content-center mt-3">
                  <Submit width="75" form="form" disabled={invalid()} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Fetch>
  )
}

const QuestionEditPage = () => (
  <div className="container h-100 py-5">
    <div className="row h-100">
      <QuestionEdit />
    </div>
  </div>
)

export default QuestionEditPage
