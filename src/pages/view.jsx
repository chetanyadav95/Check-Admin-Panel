import classnames from 'classnames'
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Fetch, Markup } from '../components/displays'
import { Tabs } from '../components/layouts'
import { QUESTIONS, QUIZ, SERIES, useFetch } from '../utilities/apis'
import { Type } from '../utilities/constants'
import { useDepartments } from '../store/application'
import { years } from '../utilities/helpers'
import { Select } from '../components/inputs'
import '../assets/styles/layouts.css'

const Questions = () => {
  const { push } = useHistory()
  const { department } = useParams()
  const departments = useDepartments()
  const subjects = departments.filter(result => result.code === department)[0].subjects

  const [questions, setQuestions] = useState([])
  
  const [ subject, setSubject ] = useState('')
  const [ year, setYear ] = useState('')
  const [ mode, setMode ] = useState('')
  const [ marks, setMarks ] = useState('')

  let url = `?department=${department}`

  return (
    <Fetch url={QUESTIONS + `all/${url}`} onFetch={setQuestions}>
      {/* ---------------------------------------------- */}

      <div className="row">
        <div className="col">
          <Select
            label="Subject"
            value={subject}
            onChange={setSubject}
            vertical
          >
            {subjects.map((subject) => (
              <option key={subject.code} value={subject.code}>
                {subject.title}
              </option>
            ))}
          </Select>

          <Select label="Marks" value={marks} onChange={setMarks} vertical>
            {[1, 2].map((mark) => (
              <option key={mark} value={mark}>
                {mark}
              </option>
            ))}
          </Select>
        </div>

        <div className="col">
          <Select label="Year" value={year} onChange={setYear} vertical>
            <option value={Type.SERIES}>Test Series</option>
            <option value={Type.QUIZ}>Quiz</option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>

          <Select label="Mode" value={mode} onChange={setMode} vertical>
            <option value="answer">Answer</option>
            <option value="choices">Options</option>
          </Select>
        </div>
      </div>
      {/* ----------------------------------------------------------------- */}
      {questions.map(
        (question, index) =>
          (question.marks && marks ? question.marks == marks : true) &&
          (question.year && year ? question.year == year : true) &&
          (question.subject && subject ? question.subject == subject : true) &&
          (mode && (question.choices && question.choices.length > 0) ?
            (mode == 'answer' && question.choices.length == 0) ||
            (mode == 'choices' && question.choices.length > 0) : true) &&
          
          (
            <div
              key={index}
              className={classnames(
                "border rounded p-3",
                index !== questions.length - 1 && "mb-3"
              )}
              onClick={() =>
                push("/view/question", { department, id: question._id })
              }
            >
              <Markup latex={question.text} className="mb-0" />

              <div className="row view-questions-data">

                <div className="col"> Subject: {question.subject}</div>

                <div className="col" >Year: {question.year}</div>

                <div className="col" >Marks: {question.marks}</div>

                <div className="col" >Mode: &nbsp;
                {question.choices && question.choices.length > 0 ?
                    'Options' : 'Answer'}</div>

              </div>
            </div>
          )
      )}
    </Fetch>
  );
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
