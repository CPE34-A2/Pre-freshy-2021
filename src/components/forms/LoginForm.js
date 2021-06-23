import { useState } from 'react'
import InputBox from '@/components/common/InputBox'
import Button from '@/components/common/Button'

export default function LoginForm(props) {
  const [formData, setFormData] = useState({ username: '', password: ''})
  const [idError, setIdError] = useState({ isError: false, message: 'Please enter a valid student id'})

  function handleId(id) {
    if (id.length > 11 || isNaN(id) && id.length > 0) {
      setIdError({...idError, isError: true})
    } else {
      setIdError({...idError, isError: false})
    }
  }
  
  function handleChange(e, type, handleInput) {
    setFormData({...formData, [type]: e.target.value})
    if (typeof(handleInput) === 'function') {
      handleInput(e.target.value)
    }
  }

  
  async function login() {
    const response = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.status == 200) {
      
    } else {

    }
  }

  return (
    <form className="mx-auto">
      <div>
        <InputBox
          className = "focus:ring-blue-300"
          placeholder="Student ID"
          type="text"
          onChange={e => handleChange(e, 'username', handleId)}
          error={idError} 
        />

        <InputBox
        className="outline-none ring-2 ring-gray-200 focus:ring-blue-300 focus:border-opacity-0 rounded-xl p-0.5 pl-1"
          placeholder="Password"
          type="password"
          onChange={e => handleChange(e, 'password')}
          error={{ isError: false, message: ''}}
        />

        <Button type="button" name="Submit" onClick={login}/>
      </div>
    </form>
  )
}