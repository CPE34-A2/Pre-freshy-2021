import { useState } from 'react'

import * as Util from '@/utils/common'
import fetchAPI from '@/utils/fetch'
import Router from 'next/router'
import Modal from '@/components/common/Modal'
import { CogIcon, XIcon } from '@heroicons/react/outline'
import InputBox from '@/components/common/InputBox'
import Button from '@/components/common/Button'
import Spinner from '@/components/common/Spinner'
import AlertNotification from '@/components/common/AlertNotification'


import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'



export default function NewsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isPasswordShowed, showPassword] = useState(false)
  const [isLoggingIn, setLoggingIn] = useState(false)

  const [changePasswordError, setChangePasswordError] = useState('')

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)


  const handleOldPasswordChange = (e) => setOldPassword(e.target.value)
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value)

  const MINIMUM_PASSWORD_LENGTH = 10

  const changePassword = async (e) => {
    e.preventDefault()

    if (!oldPassword || !newPassword)
      return setChangePasswordError('Please fill the field')

    if (newPassword.length < MINIMUM_PASSWORD_LENGTH)
      return setChangePasswordError('The new password must be atleast 10 characters')

    setChangePasswordError(true)

    fetchAPI('PATCH', '/api/auth', {
      old_password: oldPassword,
      new_password: newPassword
    })
      .then(async response => {
        if (response.status == 200) {
          setChangePasswordError('')
          Router.push('/')
        } else {
          setChangePasswordError((await response.json()).message)
        }
      })
  }



  return (
    <>
      <button
        className="block px-4 py-2 mb-2 w-full text-indigo-300 text-sm font-semibold focus:outline-none hover:bg-indigo-700 rounded-lg"
        onClick={openModal}
      >
        <div className="flex flex-row items-center">
          <CogIcon className="w-5 h-5 mr-3" /> Settings
        </div>
      </button>

      <Modal
        open={isOpen}
        close={closeModal}
      >
        <div className="transition-all transform flex flex-col py-7 px-12 max-w-xl mx-6 md:mx-0 bg-white rounded-3xl shadow-xl">
          <button
            className="absolute top-0 right-0 m-4 focus:outline-none"
            onClick={closeModal}
          >
            <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" />
          </button>

          <div className="flex flex-col justify-center w-full">
            <div className="flex flex-col justify-center text-center mt-5 mb-3 z-20">
              <h3 className="font-semibold text-2xl text-indigo-700 uppercase tracking-widest mt-2 mb-4">
                CHANGE PASSWORD
              </h3>


              <form className="mx-12 md:mx-auto ring-0 bg-white" onSubmit={changePassword}>
                <div className="flex flex-col px-10 md:px-12 ">
                  <div className="mb-5 pb-4 mx-auto">
                  </div>

                  <div className="mb-5">
                    <p className="text-xs text-gray-800 font-semibold mb-1">Old Password</p>
                    <InputBox
                      type={isPasswordShowed ? 'text' : 'password'}
                      style="w-full md:w-80 rounded-xl pr-7"
                      value={oldPassword}
                      onChange={handleOldPasswordChange}
                      error={changePasswordError}
                    />
                    
                  </div>

                  <p className="text-xs text-gray-800 font-semibold mb-1">New Password</p>
                  <div className="flex mb-5 relative">
                    <InputBox
                      type={isPasswordShowed ? 'text' : 'password'}
                      style="w-full md:w-80 rounded-xl pr-7"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      error={changePasswordError}
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
                    info={changePasswordError}
                  />



                  <Button
                    type="submit"
                    name="CHANGE PASSWORD"
                    icon={isLoggingIn && <Spinner style="mr-2 h-4 w-4 text-white" />}
                    style={Util.concatClasses(
                      "login-form-button inline-flex items-center justify-center mt-4 py-1 ring-0 rounded-3xl text-white text-sm font-semibold focus:outline-none",
                    )}
                  />
                </div>
              </form>


              <p className="text-xl text-gray-600 mb-4"></p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}