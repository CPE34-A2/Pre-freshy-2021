import { useState } from 'react'
import Router from 'next/router'
import axios from '@/utils/axios'

import InputBox from '@/components/common/InputBox'
import Button from '@/components/common/Button'
import { EyeIcon, EyeOffIcon, ExclamationCircleIcon } from '@heroicons/react/outline'

export default function LoginForm() {
  const USERNAME_REGAX = /^[0-9\b]+$/

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordShowed, showPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleUsernameChange = (e) => {
    const value = e.target.value
    if (value == '' || USERNAME_REGAX.test(value)) {
      setUsername(value)
    }
  }

  const handlePasswordChange = (e) => setPassword(e.target.value)

  const login = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      return setLoginError('Username or password is empty')
    }

    axios
      .post('/api/auth', {
        username: username,
        password: password
      })
      .then((res) => {
        setLoginError('')
        Router.push('/')
      })
      .catch((error) => {
        setLoginError('Username or password is incorrect')
      })
  }

  return (
    <form className="mx-12 md:mx-auto ring-0 shadow-lg rounded-xl bg-white" onSubmit={login}>
      <div className="flex flex-col px-10 md:px-12 py-8">
        <div className="mb-5 pb-4 mx-auto">
          <img src="/logo-with-text-alt.png" className="w-32 h-32" alt="" />
        </div>

        <div className="mb-5">
          <p className="text-xs text-gray-800 font-semibold mb-1">Student ID</p>
          <InputBox
            type="text"
            maxLength="13"
            pattern="\d*"
            style="w-full md:w-80 rounded-xl ring-1"
            value={username}
            onChange={handleUsernameChange}
            error={loginError}
          />
        </div>

        <p className="text-xs text-gray-800 font-semibold mb-1">Password</p>
        <div className="flex mb-5 relative">
          <InputBox
            type={isPasswordShowed ? 'text' : 'password'}
            style="w-full md:w-80 rounded-xl pr-7"
            value={password}
            onChange={handlePasswordChange}
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

        {loginError && (
          <div class="relative px-4 py-2 text-sm leading-normal text-red-700 bg-red-100 rounded-lg" role="alert">
            <span class="absolute inset-y-0 left-0 flex items-center ml-4">
              <ExclamationCircleIcon className="w-4 h-4 text-red-600" />
            </span>
            <p class="ml-6">{loginError}</p>
          </div>
        )}

        <Button
          type="submit"
          name="LOG IN"
          style="login-form-button mt-4 py-1 ring-0 rounded-3xl text-white text-sm font-semibold focus:outline-none "
        />
      </div>
    </form>
  )
}