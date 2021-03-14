import classnames from 'classnames'
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Fetch, Markup } from '../components/displays'
import { Tabs } from '../components/layouts'
import { QUESTIONS, QUIZ, SERIES, useFetch } from '../utilities/apis'
import { Type } from '../utilities/constants'

const Questions = () => {
  const { push } = useHistory()
  const { department } = useParams()

  const [ questions, setQuestions ] = useState([])

  let url = `?department=${department}`

  return (
    <Fetch url={QUESTIONS + `all/${url}`} onFetch={setQuestions}>
      {questions.map((question, index) => (
        <div key={index} className={classnames('border rounded p-3', index !== questions.length -1 && 'mb-3')} onClick={() => push('/view/question', { department, id: question._id })}>
          <Markup latex={question.text} className="mb-0" />
        </div>
      ))}
    </Fetch>
  )
}

const Table = ({ url, type }) => {
  const { remove } = useFetch()
  const { push } = useHistory()
  const { department } = useParams()

  const [ data, setData ] = useState([])

  const onEdit = id => () => {
    const state = { id, url, type }
    push(`/edit/${department}`, state)
  }

  const onDelete = id => () => {
    const text = type === Type.SERIES ? 'Test Series' : 'Quiz'

    if (confirm(`Remove ${text}?`)) {
      remove(url + `delete/?id=${id}`, (error, _) => {
        if (error) {
          return
        }
  
        const filtered = data.filter(value => value._id !== id)
        setData([ ...filtered ])
      })
    }
  }

  return (
    <Fetch url={url + `all/?department=${department}`} onFetch={setData}>
      <table className="table table-bordered caption-top align-middle">
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th>Name</th>
            <th className="text-center">Time</th>
            <th className="text-center">Questions</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((value, index) => (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>

              <td>{value.name}</td>

              <td className="text-center">{value.time}</td>

              <td className="text-center">{value.questions.length}</td>

              <td>
                <span className="action edit me-2" onClick={onEdit(value._id)}>
                  &#x02213;
                </span>
                
                <span className="action delete" onClick={onDelete(value._id)}>
                  &times;
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fetch>
  )
}

const ViewPage = () => (
  <Tabs>
    <Tabs.Button id="bquestion" target="pquestion" selected>
      Questions
    </Tabs.Button>

    <Tabs.Button id="bseries" target="pseries">
      Test Series
    </Tabs.Button>

    <Tabs.Button id="bquiz" target="pquiz">
      Quizzes
    </Tabs.Button>

    <Tabs.Pane id="pquestion" label="bquestion" selected>
      <Questions />
    </Tabs.Pane>

    <Tabs.Pane id="pseries" label="bseries">
      <Table url={SERIES} type={Type.SERIES} />
    </Tabs.Pane>

    <Tabs.Pane id="pquiz" label="bquiz">
      <Table url={QUIZ} type={Type.QUIZ} />
    </Tabs.Pane>
  </Tabs>
)

export default ViewPage
