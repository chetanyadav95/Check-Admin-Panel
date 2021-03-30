import classnames from 'classnames'
import { convertLatexToMarkup } from 'mathlive'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useFetch } from '../utilities/apis'
import { choiceLabel } from '../utilities/helpers'
import { Thumb } from './layouts'

/**
 * Formats a text color as error
 */

const Error = ({ text }) => {
  if (!text) return null

  return <div className="mt-3 text-danger">{text}</div>
}

Error.propTypes = {
  text: PropTypes.string
}

/**
 * Converts latex to markup
 */

const Markup = ({ label, latex, className }) => {
  function markup() {
    const newLatex = latex.replace(/\/dash/g, '______')
    
    let markup = ''

    const words = newLatex.split(' ')

    words.forEach(word => {
      let newWord = word

      if (word.includes('/eqtn')) {
        try {
          newWord = convertLatexToMarkup(word.slice(5), {
            mathstyle: 'displaystyle',
          })
        } catch (error) {
          console.log('Conversion Error', error.message)
        }
      }

      markup += newWord + ' '
    });
    
    return { __html: markup }
  }

  if (!latex) return null
  
  return (
    <p className={classnames(className)} style={{whiteSpace: 'pre-line'}}>
      {label && label} <span dangerouslySetInnerHTML={markup()} />
    </p>
  )
}

Markup.propTypes = {
  label: PropTypes.string,
  latex: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

/**
 * Displays question choices
 */

const Options = ({ choices, onChange }) => {  
  const onEdit = choice => () => {
    choice.image = ''
    onChange([ ...choices ])
  }

  return choices.map((choice, index) => (
    <div key={index} className="d-flex">
      <span>{choiceLabel(index)}</span>

      <div className="ms-3">
        <Markup className="mb-0" latex={choice.text} />
        
        <div className={classnames(choice.image && index !== choices.length - 1 && 'mb-3', choice.text && choice.image && 'mt-2')}>
          <Thumb removable={onChange} filename={choice.image} onDelete={onEdit(choice)} />
        </div>
      </div>
    </div>
  ))
}

Options.propTypes = {
  choices: PropTypes.array,
  onChange: PropTypes.func
}

/**
 * Displays solution to question
 */

const Result = ({ solution, onChange }) => {
  if (!solution.text && !solution.image) return null

  function onEdit() {
    onChange(previous => {
      previous.image = ''
      return { ...previous }
    })
  }

  return (
    <>
      <h6 className="text-decoration-underline">Solution</h6>

      {solution.text && <Markup latex={solution.text} />}
        
      <Thumb removable={onChange} filename={solution.image} onDelete={onEdit} />
    </>
  )
}

Result.propTypes = {
  solution: PropTypes.object,
  onChange: PropTypes.func
}

/**
 * Displays question marks
 */

const Score = ({ label, marks, className }) => (
  <p className={className}>
    {label && 'Total Marks: '}
    {marks} {marks > 1 ? 'Marks' : 'Mark'}
  </p>
)

Score.propTypes = {
  label: PropTypes.bool,
  marks: PropTypes.number,
  className: PropTypes.string
}

/**
 * Displays question images
 */

const Images = ({ images, onChange }) => {    
  function onEdit(image) {
    const filtered = images.filter(value => value !== image)
    onChange([...filtered])
  }

  return (
    <div className={classnames('d-flex flex-wrap gap-3', images.length > 0 && 'mb-3')}>
      {images.map((image, index) => (
        <Thumb key={index} removable={onChange} filename={image} onDelete={onEdit} />
      ))}
    </div>
  )
}

Images.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func
}

/**
 * Used for fetching data
 */

const Fetch = ({ url, onFetch, children }) => {
  const { get } = useFetch()

  const [ fetching, setFetching ] = useState(true)

  useEffect(() => {
    get(url, (error, response) => {
      if (error) return
      onFetch(response)
      setFetching(false)
    })
  }, [])

  return fetching ? (<div>Loading...</div>) : (children)
}

Fetch.propTypes = {
  url: PropTypes.string,
  onFetch: PropTypes.func,
  children: PropTypes.node
}

export { Error, Markup, Options, Result, Score, Images, Fetch }
