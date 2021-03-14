import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Submit } from '../components/buttons'
import { Input, RadioGroup, Select, Time } from '../components/inputs'
import { Selector, Tabs } from '../components/layouts'
import { useDepartments } from '../store/application'
import { QUIZ, SERIES, useFetch } from '../utilities/apis'
import { Type } from '../utilities/constants'
import { years } from '../utilities/helpers'

const Question = () => {
  const { push } = useHistory()
  const { department } = useParams()
  
  const departments = useDepartments()
  
  const [ subject, setSubject ] = useState('')
  const [ type, setType ] = useState('')
  const [ year, setYear ] = useState('')

  const subjects = departments.filter(result => result.code === department)[0].subjects

  function onSubmit(event) {
    event.preventDefault()

    let selectedYear = year
    if (type === 'series') selectedYear = Type.SERIES
    if (type === 'quiz') selectedYear = Type.QUIZ

    push('/new/question', { department, subject, year: selectedYear })
  }

  return (
    <form className="horizontal" onSubmit={onSubmit}>
      <div className="d-flex flex-column align-items-center pt-2">
        <Select label="Subject" value={subject} onChange={setSubject}>
          {subjects.map(subject => (
            <option key={subject.code} value={subject.code}>
              {subject.title}
            </option>
          ))}
        </Select>
      </div>

      <hr />

      <div className="row mt-4">
        <div className="col">
          <RadioGroup name="type" onChange={setType}>
            <RadioGroup.Button value="previous">
              Previous Year
            </RadioGroup.Button>

            <RadioGroup.Button value="series">
              Test Series
            </RadioGroup.Button>

            <RadioGroup.Button value="quiz">
              Quiz
            </RadioGroup.Button>
          </RadioGroup>
        </div>

        <div className="col">
          {type === 'previous' && (
            <Select label="Year" value={year} onChange={setYear} vertical>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <Submit width="25" disabled={!subject || !type || type === 'previous' && !year} />
      </div>
    </form>
  )
}

const Series = () => {
  const { post } = useFetch()
  const { department } = useParams()

  const [ name, setName ] = useState('')
  const [ time, setTime ] = useState(0)
  const [ questions, setQuestions ] = useState([])

  function onSubmit(event) {
    event.preventDefault()

    const data = { name, time, department, questions }

    post(SERIES + 'new', data, (error, _) => {
      if (error) {
        return
      }

      setName('')
      setTime(0)
      setQuestions([])
    })
  }

  return (
    <form className="horizontal" onSubmit={onSubmit}>
      <div className="d-flex flex-column align-items-center mt-2">
        <Input id="name" label="Name" value={name} onChange={setName}>
          Name
        </Input>

        <Time value={time} onChange={setTime} />
      </div>

      <hr />

      <Selector type={Type.SERIES} questions={questions} onChange={setQuestions} />

      <div className="d-flex justify-content-end mt-3">
        <Submit width="25" disabled={!name || time === 0 || questions.length === 0} />
      </div>
    </form>
  )
}

const Quiz = () => {
  const { post } = useFetch()
  const { department } = useParams()

  const [ name, setName ] = useState('')
  const [ time, setTime ] = useState(0)
  const [ questions, setQuestions ] = useState([])

  function onSubmit(event) {
    event.preventDefault()

    const data = { name, time, department, questions }

    post(QUIZ + 'new', data, (error, _) => {
      if (error) {
        return
      }

      setName('')
      setTime(0)
      setQuestions([])
    })
  }

  return (
    <form className="horizontal" onSubmit={onSubmit}>
      <div className="d-flex flex-column align-items-center mt-2">
        <Input id="name" label="Name" value={name} onChange={setName}>
          Name
        </Input>

        <Time value={time} onChange={setTime} />
      </div>

      <hr />

      <Selector type={Type.QUIZ} questions={questions} onChange={setQuestions} />

      <div className="d-flex justify-content-end mt-3">
        <Submit width="25" disabled={!name || time === 0 || questions.length === 0} />
      </div>
    </form>
  )
}

const NewPage = () => (
  <Tabs>
    <Tabs.Button id="bquestion" target="pquestion" selected>
      New <br /> Question
    </Tabs.Button>

    <Tabs.Button id="bseries" target="pseries">
      New <br /> Time Series
    </Tabs.Button>

    <Tabs.Button id="bquiz" target="pquiz">
      New <br /> Quiz
    </Tabs.Button>

    <Tabs.Pane id="pquestion" label="bquestion" selected>
      <Question />
    </Tabs.Pane>

    <Tabs.Pane id="pseries" label="bseries">
      <Series />
    </Tabs.Pane>

    <Tabs.Pane id="pquiz" label="bquiz">
      <Quiz />
    </Tabs.Pane>
  </Tabs>
)

export default NewPage
