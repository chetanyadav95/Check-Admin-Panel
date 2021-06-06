import { useUser } from '../store/application'

// Base API URL
const API = import.meta.env.VITE_API

/**
 * Login function
 * @param {JSON} data
 * @param {(error: JSON, result: JSON)} callback 
 */

async function login(data, callback) {
  const response = await fetch(API + 'admins/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  const result = await response.json()
  // console.log("result: ", result)

  if (!response.ok) {
    return callback(result.error)
  }

  callback(null, result)
}

/**
 * Hook for using fetch api
 * Defines use of methonds GET, POST
 * Automatically adds headers including access token
 */

function useFetch() {
  const user = useUser()

  const base = async (url, method, data, callback) => {
    const options = { method, headers: { 'x-access-token': user.token } }

    if (data) {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)

    const result = await response.json()

    if (!response.ok) {
      // console.log(result)
      return callback(result)
    }

    callback(null, result)
  }

  const get = async (url, callback) => {
    base(url, 'GET', null, callback)
  }

  const post = async (url, data, callback) => {
    base(url, 'POST', data, callback)
  }

  const update = async (url, data, callback) => {
    base(url, 'PUT', data, callback)
  }

  const remove = async (url, callback) => {
    base(url, 'DELETE', null, callback)
  }

  const upload = (file, callback) => {
    const data = new FormData()
    data.append('image', file)

    const request = new XMLHttpRequest()
    request.open('POST', API + 'images/upload')
    request.setRequestHeader('x-access-token', user.token)
    request.responseType = 'text'

    request.onerror = () => {
      callback('Failed to upload file. Try again')
    }

    request.onprogress = event => {
      callback(null, Math.round((100 * event.loaded) / event.total))
    }

    request.onloadend = function() {
      callback(null, 0, request.responseText)
    }

    request.send(data)
  }

  return { get, post, update, remove, upload }
}

export { login, useFetch }

/**
 * API Constants
 */

export const ADMINS = API + 'admins/'
export const QUESTIONS = API + 'questions/'
export const IMAGES = API + 'images/'
export const SERIES = API + 'series/'
export const QUIZ = API + 'quiz/'
