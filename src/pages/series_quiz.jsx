import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Submit } from '../components/buttons'
import { Fetch } from '../components/displays'
import { Input, Time } from '../components/inputs'
import { Selector } from '../components/layouts'
import { useFetch } from '../utilities/apis'

const SeriesQuizEdit = () => {
  const { update } = useFetch()
  const { goBack } = useHistory()
  const { state } = useLocation()

  const [ name, setName ] = useState('')
  const [ time, setTime ] = useState(0)
  const [ questions, setQuestions ] = useState([])
  const [ original, setOriginal ] = useState([])

  const { id, url, type } = state

  function setData(value) {
    setName(value.name)
    setTime(value.time)
    setQuestions(value.questions)
    setOriginal(value.questions)
  }

  function onSubmit(event) {
    event.preventDefault()

    const removed = []

    original.forEach(value => {
      if (!questions.some(question => question._id === value._id)) {
        removed.push(value._id)
      }
    })

    const data = { name, time, questions, removed }

    update(`${url}update/?id=${id}`, data, (error, _) => {
      if (error) {
        return
      }

      goBack()
    })
  }

  return (
    <Fetch url={`${url}?id=${id}`} onFetch={setData}>
      <h5 className="mb-3">
        Edit {url.includes('series') ? 'Test Series' : 'Quiz'}
      </h5>

      <form className="" onSubmit={onSubmit}>
        <div className="row row-cols-2">
          <Input id="name" label="Name" value={name} onChange={setName}>
            Name
          </Input>

          <Time value={time} onChange={setTime} />
        </div>

        <hr />

        <Selector type={type} questions={questions} onChange={setQuestions} />

        <div className="d-flex justify-content-end mt-3">
          <Submit width="25" disabled={!name || time === 0 || questions.length === 0} />
        </div>
      </form>
    </Fetch>
  )
}

const SeriesQuizEditPage = () => (
  <div className="h-100 overflow-auto">
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="w-75">
          <SeriesQuizEdit />
        </div>
      </div>
    </div>
  </div>
)

export default SeriesQuizEditPage
