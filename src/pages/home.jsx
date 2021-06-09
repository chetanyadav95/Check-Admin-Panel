import React, { useState, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Button } from '../components/buttons'
import { Select } from '../components/inputs'
import { useDepartments, useUser } from '../store/application'
import { Admin, subjects } from '../utilities/constants'

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

  const data = useUser()

  const { push } = useHistory()
  const departments = useDepartments()
  const [department, setDepartment] = useState('')
  const [permissions, SetPermissions] = useState([])
  const [hasNoPermission, SetHasPermission] = useState(false);

  useEffect(() => {
    if (data && data.permissions) {
      SetPermissions(data.permissions)
    }

    if ((data && data.role === 'master') || department && permissions.includes(department)) {
      SetHasPermission(false);
    }
    else if(department && !permissions.includes(department)) {
      SetHasPermission(true);
    }
  })

  
  const clickView = () => {
    if (data && data.role === 'master') {
      SetHasPermission(false);
      push(`/view/${department}`);
    }
    else if (permissions.includes(department)) {
      SetHasPermission(false);
      push(`/view/${department}`);
    }
    else {
      SetHasPermission(true);
    }
  }

  const clickNew = () => {
    if (data && data.role === 'master') {
      SetHasPermission(false);
      push(`/new/${department}`)
    }
    else if (permissions.includes(department)) {
      SetHasPermission(false);
      push(`/new/${department}`)
    }
    else {
      SetHasPermission(true);
    }
  }


  return (
    <div className="h-100 d-flex flex-column align-items-center justify-content-center">
      <Home />

      <div className="card">
        <div className="card-body p-5">
          <div className="d-flex flex-column align-items-center">
             
            {hasNoPermission
               && (
                <div className="alert alert-danger" role="alert">
                  Access Denied
                </div>
               )
            }
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
            <Button width="25" disabled={!department} onClick={clickView}>
              View
            </Button>

            <span className="spacer" />

            <Button width="25" disabled={!department} onClick={clickNew}>
              New
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default HomePage
