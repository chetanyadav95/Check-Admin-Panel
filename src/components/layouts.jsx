import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { Children, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../assets/styles/layouts.css'
import { useDepartments } from '../store/application'
import { IMAGES, QUESTIONS, useFetch } from '../utilities/apis'
import { Type } from '../utilities/constants'
import { years } from '../utilities/helpers'
import { Button } from './buttons'
import { Markup, Score } from './displays'
import { Select } from './inputs'

/**
 * Tab Button
 */

const TabButton = ({ id, target, selected, children }) => (
  <li className="nav-item">
    <button type="button" className={classnames('nav-link', selected && 'active')} role="tab" id={id} data-bs-toggle="tab" data-bs-target={`#${target}`} aria-controls={target} aria-selected={selected}>
      {children}
    </button>
  </li>
)

TabButton.propTypes = {
  id: PropTypes.string,
  target: PropTypes.string,
  selected: PropTypes.bool,
  children: PropTypes.node
}

/**
 * Tab Pane
 */

const TabPane = ({ id, label, selected, children }) => (
  <div className={classnames('tab-pane', selected && 'active')} role="tabpanel" id={id} aria-labelledby={label}>
    {children}
  </div>
)

TabPane.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  selected: PropTypes.bool,
  children: PropTypes.node
}

/**
 * Tabs Layout
 */

const Tabs = ({ children }) => (
  <div className="container py-5 h-100 d-flex flex-column">
    <ul className="nav nav-tabs" id="tabs" role="tablist">
      {Children.map(children, child => {
        if (child.type.name === TabButton.name) return child
      })}
    </ul>

    <div className="tab-content h-100 overflow-auto">
      {Children.map(children, child => {
        if (child.type.name === TabPane.name) return child
      })}
    </div>
  </div>
)

Tabs.propTypes = {
  children: PropTypes.node
}

Tabs.Button = TabButton
Tabs.Pane = TabPane

/**
 * Modal Layout
 */

const Modal = ({ show, size, title, onClose, onDone, children }) => (
  <div className={classnames('backdrop fade', show && 'show')}>
    <div className={classnames('modal-dialog modal-dialog-scrollable', size && `modal-${size}`)}>
      <div className="modal-content">
        <div className="modal-header">
          {title && (<h5 className="modal-title">{title}</h5>)}

          <button type="button" className="btn-close" onClick={onClose} />
        </div>

        <div className="modal-body">{children}</div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onDone}>Proceed</button>
        </div>
      </div>
    </div>
  </div>
)

Modal.propTypes = {
  show: PropTypes.bool,
  size: PropTypes.oneOf(['fullscreen']),
  title: PropTypes.string,
  onClose: PropTypes.func,
  onDone: PropTypes.func,
  children: PropTypes.node
}

/**
 * Image thumb
 */

const Thumb = ({ filename, removable, onDelete }) => {
  if (!filename) return null

  const { remove } = useFetch()

  function onClick() {
    remove(IMAGES + `delete/?filename=${filename}`, (error, _) => {
      if (error) return console.log(error)
      onDelete(filename)
    })
  }
  
  return (
    <div className="thumb">
      <img src={IMAGES + `?filename=${filename}`} />
      
      {removable && (
        <button type="button" onClick={onClick}>X</button>
      )}
    </div>
  )
}

Thumb.propTypes = {
  filename: PropTypes.string,
  removable: PropTypes.func,
  onDelete: PropTypes.func
}

/**
 * Question selection when creating a test series or quiz
 */

const Selector = ({ type, questions, onChange }) => {
  const values = [ ...questions ]

  const { department } = useParams()
  const { get } = useFetch()

  const departments = useDepartments()

  const [ show, setShow ] = useState(false)
  const [ data, setData ] = useState([])
  const [ selected, setSelected ] = useState([])
  const [ subject, setSubject ] = useState('')
  const [ year, setYear ] = useState('')
  const [ mode, setMode ] = useState('')
  const [ marks, setMarks ] = useState('')

  const subjects = departments.filter(result => result.code === department)[0].subjects
  const baseUrl = QUESTIONS + `all/?department=${department}`

  useEffect(() => {
    let url = baseUrl

    if (subject) url += `&subject=${subject}`
    if (year) url += `&year=${year}`
    if (mode) url += `&mode=${mode}`
    if (marks) url += `&marks=${marks}`
    
    get(url, (error, response) => {
      if (error) return
      setData(response)
    })
  }, [ subject, year, mode, marks ])

  function closeDialog() {
    setSelected([])
    setShow(false)
  }

  function setQuestions() {
    onChange(previous => [...previous, ...selected])
    closeDialog()
  }

  const onUp = index => () => {
    [values[index], values[index - 1]] = [values[index - 1], values[index]]
    onChange(values)
  }

  const onDown = index => () => {
    [values[index], values[index + 1]] = [values[index + 1], values[index]]
    onChange(values)
  }

  const onDelete = index => () => onChange(values.filter((_, i) => i !== index))

  const exists = question => selected.some(value => value._id === question._id)

  const onSelect = question => () => {
    if (exists(question)) return setSelected(p => p.filter(q => q._id !== question._id))
    setSelected(previous => [ ...previous, question ])
  }
  
  return (
    <>
      <div className="overflow-auto" style={{maxHeight: '350px'}}>
        <table className="table table-bordered caption-top align-middle">
          <caption>List of Questions</caption>
            
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Question</th>
              <th className="text-center">Marks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {questions.map((question, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                  
                <td className="text-ellipsis">
                  <Markup className="mb-0" latex={question.text} />
                </td>

                <td className="text-center">{question.marks}</td>

                <td>
                  <span className="action delete" onClick={onDelete(index)}>&times;</span>

                  {index > 0 && (
                    <span className="action up" onClick={onUp(index)}>&#x02191;</span>
                  )}
                  
                  {index < questions.length - 1 && (
                    <span className="action down" onClick={onDown(index)}>&#x02193;</span>
                  )}
                </td>
              </tr>
            ))}
            
            <tr>
              <td className="text-center fw-bold">#</td>
              <td className="fw-bold">Total Marks</td>
              <td className="text-center fw-bold">
                {questions.reduce((prev, cur) => prev + cur.marks, 0)}
              </td>
              <td className="fw-bold">###</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <Button width="25" onClick={() => setShow(true)}>Add Question</Button>
      </div>

      <Modal title="Select Questions" size="fullscreen" show={show} onClose={closeDialog} onDone={setQuestions}>
        <div className="mx-5">
          <div className="row">
            <div className="col">
              <Select label="Subject" value={subject} onChange={setSubject} vertical>
                {subjects.map(subject => (
                  <option key={subject.code} value={subject.code}>
                    {subject.title}
                  </option>
                ))}
              </Select>

              <Select label="Marks" value={marks} onChange={setMarks} vertical>
                {[1, 2].map(mark => (
                  <option key={mark} value={mark}>{mark}</option>
                ))}
              </Select>
            </div>

            <div className="col">
              <Select label="Year" value={year} onChange={setYear} vertical>
                <option value={Type.SERIES}>Test Series</option>
                <option value={Type.QUIZ}>Quiz</option>
                
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Select>

              <Select label="Mode" value={mode} onChange={setMode} vertical>
                <option value="answer">Answer</option>
                <option value="choices">Options</option>
              </Select>
            </div>
          </div>
          
          <hr className="mb-4" />

          {data.map(question => !questions.some(q => q._id === question._id) && (
            <div key={question._id} className={classnames('question', exists(question) && 'selected')} onClick={onSelect(question)}>
              <Markup className="mb-0" latex={question.text} />

              <div className="footer">
                <Score marks={question.marks} />

                <span className="spacer" />

                <p>Test Series Count: {question.series.length}</p>

                <span className="spacer" />

                <p>Quiz Count: {question.quizzes.length}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}

Selector.propTypes = {
  type: PropTypes.number,
  questions: PropTypes.array,
  onChange: PropTypes.func
}

export { Tabs, Modal, Thumb, Selector }
