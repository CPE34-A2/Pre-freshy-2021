import { useState } from 'react'
import Modal from '@/components/common/Modal'
import { CogIcon, XIcon } from '@heroicons/react/outline'
import InputBox from '@/components/common/InputBox'
import AlertNotification from '@/components/common/AlertNotification'
import fetchAPI from '@/utils/fetch'
import * as Util from '@/utils/common'

export default function SetMoneyModal({ user }) {
  const [notification, notify] = useState({ type: '', info: '' })
  const [isOpen, setIsOpen] = useState(false)
  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const [userId, setUserId] = useState('')
  const [amount, setAmount] = useState('')
  const [isSetting, setIsSetting] = useState(false)

  const handleAmountChange = (e) => setAmount(e.target.value)
  const handleUserIdChange = (e) => setUserId(e.target.value)

  const addMoney = (e) => {
    e.preventDefault()
    setIsSetting(true)

    fetchAPI('GET', `/api/admin/user-enforcer/?user_id=${userId}&money=${amount}`)
      .then(async response => {
        const data = await response.json()
        if (response.status == 200) {
          const moneyData = data.message.money
          notify({ type: 'success', info: <>before: <b>{moneyData.before}</b> / after <b>{moneyData.after}</b></> })
        } else {
          notify({ type: 'error', info: data.message })
        }
      })
      .finally(() => setIsSetting(false))
  }

  if (user.role != 'admin') return <></>

  return (
    <>
      <button
        className="block px-4 py-2 mb-2 w-full text-indigo-300 text-sm font-semibold focus:outline-none hover:bg-indigo-700 rounded-lg"
        onClick={openModal}
      >
        <div className="flex flex-row items-center">
          <CogIcon className="w-5 h-5 mr-3" /> Admin
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

          <form onSubmit={addMoney} className="flex flex-col">

            <p className="font-semibold">User ID</p>
            <InputBox
              type="text"
              style="w-full md:w-80 rounded-xl pr-7 ring-gray-600"
              value={userId}
              onChange={handleUserIdChange}
            />

            <p className="font-semibold mt-4">Coin amount to ADD or REMOVE</p>
            <InputBox
              type="text"
              style="w-full md:w-80 rounded-xl pr-7 ring-gray-600"
              value={amount}
              onChange={handleAmountChange}
            />

            <button
              type="submit"
              className={Util.concatClasses(
                "mt-4 bg-indigo-600 rounded-lg text-white",
                isSetting && 'opacity-60'
              )}
              disabled={isSetting}
            >
              SUMMIT
            </button>

            <AlertNotification
              type={notification.type}
              style="mt-5"
              info={notification.info}
            />
          </form>
        </div>
      </Modal>
    </>
  )
}