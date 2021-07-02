import { Component, useState } from 'react'
import Router from 'next/router'

import * as Util from '@/utils/common'
import useFetch from '@/hooks/useFetch'

import Image from 'next/image'
import LogoWithText from '@/publics/logo-with-text-alt.png'

import InputBox from '@/components/common/InputBox'
import Button from '@/components/common/Button'
import Spinner from '@/components/common/Spinner'
import AlertNotification from '@/components/common/AlertNotification'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'

export default function LoginForm() {
  const USERNAME_REGAX = /^[0-9\b]+$/

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordShowed, showPassword] = useState(false)
  const [isLoggingIn, setLoggingIn] = useState(false)
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

    setLoggingIn(true)

    useFetch('POST', '/api/auth', {
      username: username,
      password: password
    })
    .then(async response => {
      if (response.status == 200) {
        setLoginError('')
        Router.push('/')
      } else {
        setLoginError((await response.json()).message)
      }
    })
    .finally(() => setLoggingIn(false))
  }

  return (
    <form className="mx-12 md:mx-auto ring-0 shadow-lg rounded-xl bg-white" onSubmit={login}>
      <div className="flex flex-col px-10 md:px-12 py-8">
        <div className="mb-5 pb-4 mx-auto">
          <div className="w-32 h-32">
            <Image
              src={LogoWithText}
              alt="Pre-freshy 2021 Logo with text"
            />
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs text-gray-800 font-semibold mb-1">Student ID</p>
          <InputBox
            type="text"
            maxLength="11"
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

        <AlertNotification
          type="error"
          info={loginError}
        />

        <Button
          type="submit"
          name="LOG IN"
          icon={isLoggingIn && <Spinner style="mr-2 h-4 w-4 text-white" />}
          style={Util.concatClasses(
            "login-form-button inline-flex items-center justify-center mt-4 py-1 ring-0 rounded-3xl text-white text-sm font-semibold focus:outline-none",
          )}
        />
      </div>
    </form>
  )
}