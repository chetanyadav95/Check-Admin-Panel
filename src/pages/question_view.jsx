import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button } from '../components/buttons'
import { Fetch, Images, Markup, Options, Result, Score } from '../components/displays'
import { useDepartments } from '../store/application'
import { QUESTIONS, useFetch } from '../utilities/apis'
import { choiceLabel, questionType } from '../utilities/helpers'

const QuestionView = () => {
  const { state } = useLocation()
  const { push, goBack } = useHistory()
  const { update, remove } = useFetch()

  const [ question, setQuestion ] = useState(null)

  const departments = useDepartments()
  
  const department = departments.filter(value => value.code === state.department)[0]

  function review() {
    if (confirm('Mark question as reviewed?')) {
      update(QUESTIONS + `review/?id=${state.id}`, null, (error, _) => {
        if (error) return
        goBack()
      })
    }
  }

  function purge() {
    if (confirm('Are you sure you want to delete question?')) {
      remove(QUESTIONS + `delete/?id=${state.id}`, (error, _) => {
        if (error) return
        goBack()
      })
    }
  }

  return (
    <Fetch url={QUESTIONS + `?id=${state.id}`} onFetch={setQuestion}>
      {question && (
        <>
          <div className="px-3">
            <Markup latex={question.text} />

            <Images images={question.images} />

            <Options choices={question.choices} />
          </div>

          <hr />

          <div className="px-3">
            <Score marks={question.marks} label />

            <Markup label="Correct Answer:" latex={question.answer} />

            {question.choices.map((choice, index) => choice.answer && (
              <p key={index}>Correct Answer: Choice {choiceLabel(index)}</p>
            ))}

            <Result solution={question.solution} />
          </div>

          <hr />

          <div className="px-3">
            <p>
              Department: {department.title}
            </p>

            <p>
              Subject: {department.subjects.filter(value => value.code === question.subject)[0].title}
            </p>

            <p>
              {questionType(question.year)}{question.set && `, Set ${question.set}`}
            </p>
            
            <div className="d-flex">
              <p className="small text-muted">
                Posted By: {question.postedBy.username}
              </p>

              <span className="spacer" />

              <p className="small text-muted">
                Reviewed By: {question.reviewedBy ? question.reviewedBy.username : 'Not Reviewed'}
              </p>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col">
              <Button width="100" color="danger" onClick={purge}>
                Delete
              </Button>
            </div>

            <div className="col">
              {!question.reviewed && (
                <Button width="100" color="warning" onClick={() => push('/edit/question', { id: state.id })}>
                  Edit
                </Button>
              )}
            </div>

            <div className="col">
              {!question.reviewedBy && (
                <Button width="100" color="success" onClick={review}>
                  Review
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </Fetch>
  )
}

const QuestionViewPage = () => (
  <div className="h-100 py-5 overflow-auto">
    <div className="container">
      <div className="row justify-content-center">
        <div className="w-50">
          <QuestionView />
        </div>
      </div>
    </div>
  </div>
)

export default QuestionViewPage
