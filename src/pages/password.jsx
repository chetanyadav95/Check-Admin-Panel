import React, { useState } from 'react'
import { Submit } from '../components/buttons'
import { Input } from '../components/inputs'
import { ADMINS, useFetch } from '../utilities/apis'

const Password = () => {
  const { update } = useFetch()

  const [ password, setPassword ] = useState('')
  const [ confirmation, setConfirmation ] = useState('')

  function onPasswordChange(event) {
    event.preventDefault()

    update(ADMINS + 'password', { password }, (error, _) => {
      if (error) {
        return
      }

      alert('Password Successfully changed')
      setPassword('')
      setConfirmation('')
    })
  }

  return (
    <form onSubmit={onPasswordChange}>
      <Input id="password" type="password" value={password} onChange={setPassword}>
        Password
      </Input>

      <Input id="confirm" type="password" value={confirmation} onChange={setConfirmation}>
        Confirm Password
      </Input>

      <Submit disabled={!password.trim() || !confirmation.trim() || password !== confirmation}>
        Change Password
      </Submit>
    </form>
  )
}

const PasswordPage = () => (
  <div className="h-100 d-flex justify-content-center align-items-center">
    <div className="card" style={{width: '350px'}}>
      <div className="card-body p-5">
        <Password />
      </div>
    </div>
  </div>
)

export default PasswordPage
