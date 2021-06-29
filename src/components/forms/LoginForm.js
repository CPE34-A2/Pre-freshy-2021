import { useState } from 'react'
import Router from 'next/router'
import axios from '@/utils/axios'

import InputBox from '@/components/common/InputBox'
import Button from '@/components/common/Button'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'

export default function LoginForm() {
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

    const result = await axios.post('/api/auth', formData)
    
    if (result.status == 200) {
      setLoginError('')
      Router.push('/')
    } else {
      setLoginError('Username or password is incorrect')
    }
  }

  return (
    <form className="mx-auto ring-0 shadow-lg rounded-xl bg-white">
      <div className="flex flex-col px-12 py-8">
        <div className="mb-5 pb-4">
          <h3 className="login-form-title text-left drop-shadow-sm font-extrabold text-3xl leading-none tracking-tight">
            WELCOME
          </h3>
          <h3 className="login-form-title mt-2 text-left drop-shadow-sm font-extrabold text-lg leading-none tracking-tight">
            FRESHY CPE 2021
          </h3>
          <div className="mt-2 text-md text-gray-400 font-semibold">Login to continue</div>
        </div>

        <div className="mb-5">
          <p className="text-xs text-gray-700 font-semibold mb-1">Student ID</p>
          <InputBox
            type="text"
            style="w-full md:w-80 rounded-xl ring-1"
            onChange={e => handleChange(e, 'username', validUsername)}
            error={usernameError || loginError}
          />
        </div>

        <p className="text-xs text-gray-700 font-semibold mb-1">Password</p>
        <div className="flex mb-5 relative">
          <InputBox
            type={isPasswordShowed ? 'text' : 'password'}
            style="w-full md:w-80 rounded-xl pr-7"
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
          name="LOG IN"
          style="login-form-button mt-4 py-1 ring-0 rounded-3xl text-white text-sm font-semibold focus:outline-none "
          onClick={login} />
      </div>
    </form>
  )
}