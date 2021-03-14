import PropTypes from 'prop-types'
import React, { createContext, useContext, useState } from 'react'
import { login as LOGIN } from '../utilities/apis'

const ApplicationContext = createContext()

/**
 * hook for application provider
 */

function useProvider() {
  const [ user, setUser ] = useState(null)
  const [ departments, setDepartments ] = useState([])

  const login = (credentials, callback) => {
    LOGIN(credentials, (error, result) => {
      if (error) return callback(error)
      setUser(result.user)
      setDepartments(result.departments)
      callback(null)
    })
  }

  const logout = () => {
    setUser(null)
    setDepartments([])
  }

  return { user, departments, login, logout }
}

/**
 * hook for authentication functions
 */

function useAuth() {
  const context = useContext(ApplicationContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within ApplicationProvider')
  }

  const { login, logout } = context

  return { login, logout }
}

/**
 * hook for user
 */

function useUser() {
  const context = useContext(ApplicationContext)

  if (context === undefined) {
    throw new Error('useUser must be used within ApplicationProvider')
  }

  return context.user
}

/**
 * hook for departments
 */

function useDepartments() {
  const context = useContext(ApplicationContext)

  if (context === undefined) {
    throw new Error('useDepartments must be used within ApplicationProvider')
  }

  return context.departments
}

/**
 * Provider for entire application
 * @param {Object} children
 */

const ApplicationProvider = ({ children }) => {
  const provider = useProvider()

  return (
    <ApplicationContext.Provider value={provider}>
      {children}
    </ApplicationContext.Provider>
  )
}

ApplicationProvider.propTypes = {
  children: PropTypes.object
}

export { ApplicationProvider, useAuth, useUser, useDepartments }
