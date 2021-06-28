import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { Button, Equation } from './buttons'
import { Image } from './inputs'

/**
 * Enter question
 */

const Question = ({ value, onChange, onImages }) => {
  const ref = useRef()

  function onDash() {
    const dash = value.length === 0 || value.endsWith(' ') ? '/dash ' : ' /dash '
    onChange(previous => previous + dash)
    ref.current.focus()
  }

  function onEquation(text) {
    const equation = value.length === 0 || value.endsWith(' ') ? text : ' ' + text
    onChange(previous => previous + equation)
  }

  return (
    <div className="mb-3">
      <label className="form-label">Question</label>

      <textarea rows="5" className="form-control" ref={ ref } value={ value } onChange={ event => onChange(event.target.value) }></textarea>

      <div className="d-flex mt-3">
        <Button className="me-3 square" onClick={ onDash }>&#x0005F;</Button>

        <Equation inputRef={ ref } onEntered={ onEquation } />

        <Image className="ms-3" onUpload={ value => onImages(values => [...values, value]) } />
      </div>
    </div>
  )
}

Question.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onImages: PropTypes.func
}

/**
 * Enter marks for a question
 */

const Marks = ({ value, onChange }) => {
  function addMarks() { onChange(previous => previous + 1) }

  function minusMarks() { if (value > 1) onChange(previous => previous - 1) }

  return (
    <div className="mb-3">
      <label className="form-label">Marks</label>

      <div className="d-flex">
        <Button className="square" onClick={ minusMarks }>-</Button>

        <div className="form-control mx-3 text-center">{ value }</div>

        <Button className="square" onClick={ addMarks }>+</Button>
      </div>
    </div>
  )
}

Marks.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func
}

/**
 * Answer to question
 */

const Answer = ({ value, onChange, children }) => {
  const ref = useRef()

  function onEquation(text) {
    const equation = value.length === 0 || value.endsWith(' ') ? text : ' ' + text
    onChange(previous => previous + equation)
  }

  return (
    <div className="d-flex mb-3">
      <div className="col">
        <input type="text" className="form-control" ref={ ref } value={ value } onChange={ event => onChange(event.target.value) } />
      </div>

      <div className="ms-3 d-flex">
        <Equation inputRef={ ref } onEntered={ onEquation } />
        { children }
      </div>
    </div>
  )
}

Answer.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.node
}

/**
 * Single choice
 */

const Choice = ({ choice, onChange }) => {
  const ref = useRef()

  const { text, image, answer } = choice

  function onEquation(value) {
    const equation = text.length === 0 || text.endsWith(' ') ? value : ' ' + value
    onChange('text', text + equation)
  }

  return (
    <div className="d-flex mb-3">
      <div className="col">
        <input type="text" className="form-control" ref={ ref } value={ text } onChange={ event => onChange('text', event.target.value) } />
      </div>

      <div className="ms-3 d-flex">
        <Equation inputRef={ ref } onEntered={ onEquation } />

        <Image className="mx-3" onUpload={ value => onChange('image', value) } />

        <Button className="square" color={ answer ? 'success' : 'primary' } disabled={ !text && !image } onClick={ () => onChange('answer', !answer) }>
          &#x02713;
        </Button>
      </div>
    </div>
  )
}

Choice.propTypes = {
  choice: PropTypes.object,
  onChange: PropTypes.func
}

/**
 * Choices to question
 */

const Choices = ({ values, onChange }) => {
  const onEdit = choice => (node, value) => {
    choice[node] = value
    onChange([...values])
  }

  return values.map((choice, index) => (
    <Choice key={ index } choice={ choice } onChange={ onEdit(choice) } />
  ))
}

Choices.propTypes = {
  values: PropTypes.array,
  onChange: PropTypes.func
}

Choices.NODES = { text: '', image: '', answer: false }

/**
 * Solution to question
 */

const Solution = ({ value, onChange }) => {
  const ref = useRef()

  function onEdit(node, value) {
    onChange(previous => {
      previous[node] = value
      return { ...previous }
    })
  }

  function onImage(value) {
    onChange(previous => {
      previous.images.push(value)
      return { ...previous }
    })
  }

  function onEquation(text) {
    const prev = value.text
    const equation = prev.length === 0 || prev.endsWith(' ') ? text : ' ' + text

    onChange(previous => {
      previous.text = previous.text + equation
      return { ...previous }
    })
  }

  return (
    <div className="mb-3">
      <label htmlFor="solution" className="form-label">Solution</label>

      <textarea id="solution" rows="5" className="form-control" ref={ ref } value={ value.text } onChange={ event => onEdit('text', event.target.value) }></textarea>

      <div className="d-flex mt-3">
        <Equation inputRef={ ref } onEntered={ onEquation } />

        <Image className="ms-3" onUpload={ onImage } />
      </div>
    </div>
  )
}

Solution.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func
}

Solution.NODES = { text: '', image: '', images: [] }

/**
 * Question mode: Answer or Choices
 */

const Mode = ({ value, onChange }) => (
  <div className="mb-3">
    <label className="form-label">Mode</label>

    <div>
      <div className="form-check form-check-inline">
        <input className="form-check-input" type="radio" name="mode" id="answer" checked={ value === Mode.answer } onChange={ () => onChange(Mode.answer) } />

        <label className="form-check-label" htmlFor="answer">Answer</label>
      </div>

      <div className="form-check form-check-inline">
        <input className="form-check-input" type="radio" name="mode" id="options" checked={ value === Mode.options } onChange={ () => onChange(Mode.options) } />

        <label className="form-check-label" htmlFor="options">Options</label>
      </div>
    </div>
  </div>
)

Mode.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}

Mode.answer = 'answer'
Mode.options = 'options'

export { Question, Marks, Answer, Choices, Solution, Mode }
