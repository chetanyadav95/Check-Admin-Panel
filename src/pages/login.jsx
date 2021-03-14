import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Submit } from '../components/buttons'
import { Error } from '../components/displays'
import { Input } from '../components/inputs'
import { useAuth } from '../store/application'

const LoginPage = () => {
  const auth = useAuth()
  const history = useHistory()

  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ error, setError ] = useState('')

  function onLogin(event) {
    event.preventDefault()

    auth.login({ username, password }, (error) => {
      if (error) return setError(error)
      history.push('/')
    })
  }

  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div className="card" style={{width: '350px'}}>
        <div className="card-body p-5">
          <form onSubmit={onLogin}>
            <Input id="username" value={username} onChange={setUsername}>
              Username
            </Input>

            <Input id="password" type="password" value={password} onChange={setPassword}>
              Password
            </Input>

            <Submit disabled={!username.trim() || !password.trim()}>
              Login
            </Submit>

            <Error text={error} />
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
