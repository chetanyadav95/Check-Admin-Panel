import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { Children, useState } from 'react'
import S3 from 'react-aws-s3'
import '../assets/styles/inputs.css'
import { useFetch } from '../utilities/apis'
import { Button } from './buttons'

/**
 * input
 * accepts types: text, password
 */

const Input = ({ id, type, value, placeholder, onChange, children }) => (
  <div className="form-group mb-3">
    {children && (<label htmlFor={id} className="form-label">{children}</label>)}

    <input className="form-control" placeholder={placeholder} type={type} id={id} value={value} onChange={event => onChange(event.target.value)} />
  </div>
)

Input.defaultProps = {
  type: 'text'
}

Input.propTypes = {
  id: PropTypes.string,
  type: PropTypes.oneOf(['text', 'password']),
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.string
}

/**
 * select
 */

const Select = ({ label, value, onChange, vertical, children }) => (
  <div className={classnames('mb-3', !vertical && 'form-group')}>
    {label && <label className="form-label">{label}</label>}

    <select className="form-select" value={value} onChange={event => onChange(event.target.value)}>
      <option value="">Select Option</option>
      {children}
    </select>
  </div>
)

Select.defaultProps = {
  vertical: false
}

Select.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  vertical: PropTypes.bool,
  children: PropTypes.node
}

/**
 * check input
 * used for creating checkbox or radio button
 */

const Check = ({ type, name, className, value, children }) => (
  <div className={`form-check ${className}`}>
    <input className="form-check-input" type={type} name={name} id={value} value={value} />
    
    <label className="form-check-label" htmlFor={value}>{children}</label>
  </div>
)

Check.defaultProps = {
  type: 'checkbox',
  className: 'mb-3'
}

Check.propTypes = {
  type: PropTypes.oneOf(['checkbox', 'radio']),
  name: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.string,
}

/**
 * Radio Button
 */

const RadioGroup = ({ label, name, inline, onChange, children }) => (
  <div className={classnames(inline && 'mb-3')}>
    {label && <label className="form-label">{label}</label>}

    <div onChange={event => onChange(event.target.value)}>    
      {Children.map(children, child => {
        if (child.type.name === Check.name) {
          return <Check {...child.props} name={name} className={classnames(inline ? 'form-check-inline' : 'mb-3')} type="radio" />
        }
      })}
    </div>
  </div>
)

RadioGroup.Button = Check

RadioGroup.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  inline: PropTypes.bool,
  onChange: PropTypes.func,
  child: PropTypes.node
}

/**
 * time input which returns time in minutes
 */

const Time = ({ value, onChange }) => {
  const hours = Math.trunc(value / 60)
  const minutes = value % 60
  
  const [ active, setActive ] = useState('hours')

  function onActive(value) { if (value !== active) setActive(value) }

  function decrement() {
    if (active === 'hours') {
      if (hours > 0) onChange(previous => previous - 60)
    } else {
      if (minutes > 0) onChange(previous => previous - 1)
    }
  }

  function increment() {
    if (active === 'hours') {
      if (hours < 24) onChange(previous => previous + 60)
    } else {
      if (minutes < 59) onChange(previous => previous + 1)
    }
  }

  return (
    <div className="form-group mb-3">
      <label className="form-label">Time</label>

      <div className="time form-control">
        <div className={classnames('indicator', active === 'hours' && 'active')} onClick={() => onActive('hours')}>
          {hours.toString().length < 2 ? `0${hours}` : hours}
        </div>

        <span className="mx-2">:</span>

        <div className={classnames('indicator', active === 'minutes' && 'active')} onClick={() => onActive('minutes')}>
          {minutes.toString().length < 2 ? `0${minutes}` : minutes}
        </div>

        <span className="ms-2">hrs</span>

        <span className="spacer"></span>

        <span className="button" onClick={decrement}>&#x025C2;</span>

        <span className="button" onClick={increment}>&#x025B8;</span>
      </div>
    </div>
  )
}

Time.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func
}

/**
 * File input. Used for uploading images
 */

const Image = ({ className, onError, onUpload }) => {
  const { upload } = useFetch()
  
  const [ progress, setProgress] = useState(0)

  const S3Client = new S3({
    bucketName: 'set2score',
    region: 'ap-south-1',
    accessKeyId: 'AKIAWE63H53ZT4SURBJY',
    secretAccessKey: '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',
  })

  function onChange(target) {
    setProgress(0)

    //upload(target.files[0], (error, progress, result) => {
      //if (error) return onError(error)
      //if (progress !== null) setProgress(progress)
      //if (result) onUpload(result)
    //})

    S3Client.uploadFile(target.files[0]).then(data => onUpload(data.location)).catch(error => {
      console.log(error);
      onError(error);
    });
  }

  return (
    <label className={classnames('file-label', className)}>
      <Button className="square">
        <i className="bi bi-paperclip" style={{fontSize: '12px'}}></i>
      </Button>

      <input type="file" accept=".jpg, .jpeg, .png" onChange={event => onChange(event.target)} />

      <div className="progress">
        <div className="progress-bar bg-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{width: progress}} />
      </div>
    </label>
  )
}

Image.propTypes = {
  className: PropTypes.string,
  onError: PropTypes.func,
  onUpload: PropTypes.func
}

export { Input, Select, RadioGroup, Time, Image }
