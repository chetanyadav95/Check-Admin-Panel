import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import './assets/styles/application.css'
import LoginPage from './pages/login'
import { ApplicationProvider, useAuth, useUser } from './store/application'
import routes from './utilities/routes'

/**
 * Route that redirects to login page if user is not authenticated
 */

 const AuthRoute = ({ path, page, exact }) => {
  const user = useUser()
  const component = user ? page : <Redirect to="/login" />
  return <Route path={path} exact={exact} render={() => component} />
}

/**
 * Application entry point
 */

const Application = () => {
  const auth = useAuth()
  const user = useUser()
  const history = useHistory()
  
  const { pathname } = useLocation()

  return (
    <>
      <header>
        <div className="brand">
          {!(pathname === '/' || pathname === '/login') && (
            <button className="btn" onClick={() => history.goBack()}>
              <i className="bi bi-arrow-left"></i>
            </button>
          )}

          <Link to="/">Set2Score</Link>
        </div>

        {user && (
          <>
            <span className="spacer text-center">{user.username}</span>

            <button className="btn border" onClick={() => auth.logout()}>Logout</button>
          </>
        )}
      </header>

      <main>
        <Switch>
          <Route path="/login" component={LoginPage} />

          {routes.map(({ path, exact, page }, index) => (
            <AuthRoute key={index} path={path} exact={exact} page={page()} />
          ))}
        </Switch>
      </main>
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    <ApplicationProvider>
      <BrowserRouter>
        <Application />
      </BrowserRouter>
    </ApplicationProvider>
  </StrictMode>,
  document.getElementById('root')
)
