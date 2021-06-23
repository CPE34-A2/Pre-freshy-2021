import { useState } from 'react'
import InputBox from '@/components/common/InputBox'
import Button from '@/components/common/Button'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'

export default function LoginForm(props) {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [isPasswordShowed, showPassword] = useState(false)

  const [usernameError, setUsernameError] = useState('')
  const [loginError, setLoginError] = useState('')

  function validUsername(username) {
    if (username.length > 11 || (isNaN(username) && username.length > 0)) {
      setUsernameError('Please enter a valid student id')
    } else {
      setUsernameError('')
    }
  }

  function handleChange(e, type, handleInput) {
    loginError && setLoginError('')
    setFormData({ ...formData, [type]: e.target.value })
    if (typeof handleInput === 'function') {
      handleInput(e.target.value)
    }
  }

  async function login() {
    for (let key in formData) {
      if (!formData[key]) return setLoginError('Username or password is empty')
    }

    let response = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.status == 200) {
      setLoginError('')
    } else {
      setLoginError('Username or password is incorrect')
    }
  }

  return (
    <form className="mx-auto p-10 ring-1 ring-gray-100 shadow-lg rounded-xl bg-gray-100">
      <div className="flex flex-col px-5 py-4">
        <div className="mb-5 pb-4">
          <h3 className="text-left font-extrabold text-4xl bg-gradient-to-b from-blue-700 to-blue-300 bg-clip-text text-transparent leading-none tracking-tight">
            Welcome<br />Freshy CPE<br />
          </h3>
          <div className="mt-2 text-md text-gray-400 font-semibold">Login to continue</div>
        </div>

        <div className="mb-5">
          <p className="text-xs text-gray-600 font-semibold mb-1">Student ID</p>
          <InputBox
            type="text"
            style="w-72 rounded-md"
            onChange={e => handleChange(e, 'username', validUsername)}
            error={usernameError || loginError}
          />
        </div>

        <p className="text-xs text-gray-600 font-semibold mb-1">Password</p>
        <div className="flex mb-5 relative">
          <InputBox
            type={isPasswordShowed ? 'text' : 'password'}
            style="w-full rounded-md pr-7"
            onChange={e => handleChange(e, 'password')}
            error={loginError}
          />
          <div className="absolute inset-y-0 mr-2 right-0 flex items-center">
            <button
              type="button"
              className="focus:outline-none"
              onClick={() => showPassword(!isPasswordShowed)}
            >
              {isPasswordShowed ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="button"
          name="Log in"
          style="mt-4 py-2 ring-1 ring-gray-300 rounded-3xl bg-blue-700 text-white font-semibold focus:outline-none focus:ring-blue-100 hover:bg-blue-900"
          onClick={login} />
      </div>
    </form>
  )
}