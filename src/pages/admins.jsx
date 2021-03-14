import React, { useState } from 'react'
import { Submit } from '../components/buttons'
import { Fetch } from '../components/displays'
import { Input, Select } from '../components/inputs'
import { ADMINS, useFetch } from '../utilities/apis'
import { Admin as Role } from '../utilities/constants'

const Admin = () => {
  const { post, update } = useFetch()

  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ role, setRole ] = useState('')
  const [ admins, setAdmins ] = useState([])

  function onSubmit(event) {
    event.preventDefault()

    const data = { username, password, role }

    post(ADMINS + 'new', data, (error, result) => {
      if (error) {
        return
      }

      setAdmins(previous => [...previous, result])
      setUsername('')
      setPassword('')
      setRole('')
    })
  }

  const onChange = (admin, data) => () => {
    const key = Object.keys(data)[0]

    let text;

    if (key === 'role') {
      text = `Change ${admin.username}'s role to ${data[key]}?`
    } else if (key === 'disabled') {
      text = `${data[key] ? 'Disable' : 'Enable'} ${admin.username}'s account?`
    } else {
      text = `Reset ${admin.username}'s password?`
    }

    if (confirm(text)) {
      update(ADMINS + `update/?id=${admin._id}`, data, (error, _) => {
        if (error) {
          return
        }

        if (key === 'password') {
          return alert(`Success: Password reset to ${data[key]}`)
        }
  
        admin[key] = data[key]
        setAdmins([ ...admins ])
      });
    }
  }

  return (
    <>
      <h5 className="mb-3">Add Admin</h5>
      
      <form className="row row-cols-2 g-3 gx-5" onSubmit={onSubmit}>
        <div className="col">
          <Input placeholder="Username" value={username} onChange={setUsername} />
        </div>

        <div className="col">
          <Input placeholder="Password" value={password} onChange={setPassword} />
        </div>

        <div className="col">
          <Select value={role} onChange={setRole}>
            <option value={Role.SENIOR}>Senior</option>
            <option value={Role.SUPPORT}>Support</option>
          </Select>
        </div>

        <div className="col">
          <Submit disabled={!username || !password || !role} />
        </div>
      </form>

      <hr />

      <Fetch url={ADMINS + 'all'} onFetch={setAdmins}>
        <table className="table table-bordered caption-top align-middle">
          <caption className="pt-0">Administrators</caption>

          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {admins.map((admin, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>

                <td>{admin.username}</td>

                <td>{admin.role}</td>

                <td>
                  {admin.role === Role.SENIOR && (
                    <span className="action down" onClick={onChange(admin, { role: Role.SUPPORT })}>
                      &#x02193;
                    </span>
                  )}

                  {admin.role === Role.SUPPORT && (
                    <span className="action up" onClick={onChange(admin, { role: Role.SENIOR })}>
                      &#x02191;
                    </span>
                  )}

                  <span className="action back mx-2" onClick={onChange(admin, { password: admin.username })}>
                    &#x02190;
                  </span>

                  {admin.disabled && (
                    <span className="action check" onClick={onChange(admin, { disabled: false })}>
                      &#x02713;
                    </span>  
                  )}

                  {!admin.disabled && (
                    <span className="action delete" onClick={onChange(admin, { disabled: true })}>
                      &times;
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fetch>
    </>
  )
}

const AdminsPage = () => (
  <div className="h-100 overflow-auto">
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="w-75">
          <Admin />
        </div>
      </div>
    </div>
  </div>
)

export default AdminsPage
