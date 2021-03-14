import classnames from 'classnames'
import { MathfieldElement } from 'mathlive'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { Modal } from './layouts'

/**
 * Create a primary button
 */

const Button = ({ width, color, className, children, ...props }) => (
  <button type="button" className={classnames(`btn btn-${color}`, width && `w-${width}`, className)} {...props}>
    {children}
  </button>
)

Button.defaultProps = {
  color: 'primary',
  disabled: false,
}

Button.propTypes = {
  width: PropTypes.oneOf(['100', '75', '50', '25']),
  color: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node
}

/**
 * Creates a submit button with predefined formatting
 */

const Submit = ({ width, disabled, children, ...props }) => (
  <button type="submit" className={`btn btn-primary w-${width}`} disabled={disabled} {...props}>
    {children}
  </button>
)

Submit.defaultProps = {
  width: '100',
  disabled: false,
  children: 'Submit'
}

Submit.propTypes = {
  width: PropTypes.oneOf(['100', '75', '50', '25']),
  disabled: PropTypes.bool,
  children: PropTypes.string
}

/**
 * Displays a modal to enter equation when clicked
 */

const Equation = ({ inputRef, onEntered }) => {
  const mathFieldRef = useRef()

  const [ active, setActive ] = useState(false)
  const [ equation, setEquation ] = useState('')
    
  const mathFieldElement = new MathfieldElement({
    defaultMode: "math",
    letterShapeStyle: "tex",
    virtualKeyboardMode: "onfocus",
  })

  mathFieldElement.addEventListener('input', event => setEquation(event.target.value))

  function openDialog() {
    mathFieldRef.current.appendChild(mathFieldElement)
    setActive(true)
  }

  function closeDialog() {
    mathFieldRef.current.removeChild(mathFieldRef.current.children[0])
    setEquation('')
    setActive(false)
    inputRef.current.focus()
  }

  function getLatex() {
    onEntered(`/eqtn${equation} `)
    closeDialog()
  }

  return (
    <>
      <Modal title="Enter Equation" show={active} onClose={closeDialog} onDone={getLatex}>
        <div ref={mathFieldRef} className="my-3" />
      </Modal>
      
      <Button className="square" onClick={openDialog}>&Sigma;</Button>
    </>
  )
}

Equation.propTypes = {
  inputRef: PropTypes.object,
  onEntered: PropTypes.func
}

export { Button, Submit, Equation }
