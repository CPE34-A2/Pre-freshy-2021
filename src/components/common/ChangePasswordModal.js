import { useState } from 'react'

import * as Util from '@/utils/common'
import fetchAPI from '@/utils/fetch'
import Router from 'next/router'
import Modal from '@/components/common/Modal'
import { CogIcon, XIcon } from '@heroicons/react/outline'
import InputBox from '@/components/common/InputBox'
import Button from '@/components/common/Button'
import AlertNotification from '@/components/common/AlertNotification'

export default function NewsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isPasswordShowed, showPassword] = useState(false)
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
            <div className="flex flex-col justify-center text-center mt-5 mb-3 z-20 flex-grow-0">
              <h3 className="font-semibold text-2xl text-indigo-700 uppercase tracking-widest mt-2 mb-4">
                CHANGE PASSWORD
              </h3>

              <form className="ring-0 bg-white" onSubmit={changePassword}>
                <div className="flex flex-col justify-center items-center md:px-12">
                  <p className="text-sm text-gray-800 font-semibold mb-1">Old Password</p>
                  <InputBox
                    type={isPasswordShowed ? 'text' : 'password'}
                    style="w-full md:w-80 rounded-xl pr-7 ring-gray-400"
                    value={oldPassword}
                    onChange={handleOldPasswordChange}
                    error={changePasswordError}
                  />

                  <p className="text-sm text-gray-800 font-semibold mb-1 mt-5">New Password</p>
                  <InputBox
                    type={isPasswordShowed ? 'text' : 'password'}
                    style="w-full md:w-80 rounded-xl pr-7 ring-gray-400"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    error={changePasswordError}
                  />

                  <AlertNotification
                    type="error"
                    style="mt-5"
                    info={changePasswordError}
                  />

                  <Button
                    type="submit"
                    name="CHANGE PASSWORD"
                    style={Util.concatClasses(
                      "login-form-button mt-6 mb-3 py-2 ring-0 rounded-3xl text-white text-sm font-semibold focus:outline-none w-full",
                    )}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}