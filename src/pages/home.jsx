import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button } from '../components/buttons'
import { Select } from '../components/inputs'
import { useDepartments, useUser } from '../store/application'
import { Admin } from '../utilities/constants'

const Home = () => {
  const { role } = useUser()

  return (
    <div className="mb-4 text-center d-flex flex-column">
      <h6 className="text-muted text-capitalize">{role} Admin</h6>

      {role === Admin.MASTER && (
        <Link to="/admins" className="mb-2">View Administrators</Link>
      )}

      <Link to="/password">Change Password</Link>
    </div>
  )
}

const HomePage = () => {
  const { push } = useHistory()
  
  const departments = useDepartments()

  const [ department, setDepartment ] = useState('')

  return (
    <div className="h-100 d-flex flex-column align-items-center justify-content-center">
      <Home />

      <div className="card">
        <div className="card-body p-5">
          <div className="d-flex flex-column align-items-center">
            <h4 className="fw-bold mb-4">
              Select Department
            </h4>

            <Select value={department} onChange={setDepartment}>
              {departments.map(department => (
                <option key={department.code} value={department.code}>
                  {department.title}
                </option>
              ))}
            </Select>
          </div>

          <div className="my-4" />

          <div className="d-flex">
            <Button width="25" disabled={!department} onClick={() => push(`/view/${department}`)}>
              View
            </Button>

            <span className="spacer" />

            <Button width="25" disabled={!department} onClick={() => push(`/new/${department}`)}>
              New
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
