import { Dialog } from '@headlessui/react'
import { ChevronRightIcon, XIcon } from '@heroicons/react/outline'
import { useState, useEffect } from 'react'
import Image from 'next/image'

import * as Util from '@/utils/common'
import useFetch from '@/hooks/useFetch'

import Modal from '@/components/common/modal'
import InputBox from '@/components/common/InputBox'
import AlertNotification from '@/components/common/AlertNotification'
import Button from '@/components/common/Button'
import Spinner from '@/components/common/Spinner'
import MoneyImage from '@/publics/money.png'

export default function DonateMoneyModal({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDonating, setIsDonating] = useState(false)
  const [amount, setAmount] = useState('')
  const [donateDone, setDonateDone] = useState('')
  const [donateError, setDonateError] = useState('')

  useEffect(() => {
    // Revalidate while input donate and someone gives coin
    (donateError && ((amount) && (amount != 0) && (user.money >= amount))) && setDonateError('')
  })

  const openModal = () => setIsOpen(true)
  const closeModal = () => { setIsOpen(false); setDonateError(''); setAmount(''); setDonateDone(false); }

  const handleDonateChange = (e) => {
    const value = e.target.value

    // Prevent user to input non-integer, starts with 0 and negative integer
    const isNotInteger = !(/^\+?(0|[1-9]\d*)$/.test(value))
    const isStartsWithZero = (/^0/.test(value))

    if (isNaN(value) || isStartsWithZero || (value && isNotInteger) || parseInt(value) < 0) return

    setDonateError((value > user.money) ? 'Your coin is not enough' : '')
    setDonateDone(!donateError && '')
    setAmount(value)
  }

  const sendDonate = (e) => {
    e.preventDefault()

    if (!amount) {
      return setDonateError('Please insert your coin amount')
    }

    setIsDonating(true)
    setDonateDone(false)

    useFetch('POST', `/api/users/${user._id}/transfer/coin`, { amount: amount })
      .then(async response => {
        if (response.status == 200) {
          setDonateDone(<>Donation successful <b>(-{Util.numberWithCommas(amount)} coin)</b></>)
        } else {
          setDonateError('Something went wrong')
        }
      })
      .finally(() => {
        setIsDonating(false)
      })
  }

  return (
    <>
      <button
        className={Util.concatClasses(
          "animate-ping p-1 hover:bg-purple-300 rounded-lg focus:outline-none",
          (user.money == 0) && 'hidden'
        )}
        onClick={openModal}
      >
        <ChevronRightIcon className="text- purple-800 w-4 h-4" />
      </button>

      <Modal
        open={isOpen}
        close={closeModal}
      >
        <div className="transition-all transform flex flex-col py-7 px-12 max-w-sm mx-6 md:mx-0 bg-white rounded-3xl shadow-xl">
          <button
            type="button"
            className="absolute top-0 right-0 m-4 focus:outline-none"
            onClick={closeModal}
          >
            <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" />
          </button>

          <div className="hidden md:flex absolute top-0 left-0 -translate-y-8 translate-x-6 w-32 h-32">
            <Image src={MoneyImage} />
          </div>

          <div className="flex flex-row justify-center mb-6">
            <div className="flex w-44 items-center justify-center">
              <div className="flex md:hidden w-24 h-24">
                <Image src={MoneyImage} />
              </div>
            </div>

            <div className="flex flex-col ml-4 justify-center">
              <Dialog.Title as="h3" className="font-semibold text-lg leading-tight">
                Donate to your clan.
              </Dialog.Title>

              <Dialog.Description className="font-light text-xs font-gray-800 mt-2">
                Drive your team to victory by giving away your special coins
              </Dialog.Description>
            </div>
          </div>

          <AlertNotification
            type={donateDone ? 'success' : 'error'}
            info={donateDone || donateError}
            style="mb-3"
          />

          <form className="flex flex-row drop-shadow-md mb-3 md:mb-1" onSubmit={sendDonate}>
            <InputBox
              type="text"
              pattern="\d*"
              style="flex-grow w-24 rounded-l-lg bg-purple-100 ring-1 ring-purple-200 focus:ring-purple-500 text-purple-800"
              value={amount}
              onChange={handleDonateChange}
            />

            <Button
              type="submit"
              name={isDonating ? "DONATING" : "DONATE"}
              icon={isDonating && <Spinner style="mr-2 w-3 h-3 text-white" />}
              style={Util.concatClasses(
                "inline-flex items-center justify-center px-3 bg-purple-700 rounded-r-lg ring-1 ring-purple-800 shadow-md font-semibold text-white text-sm disabled:opacity-50",
                (donateError) || (user.money < amount) ? 'cursor-not-allowed' : 'hover:bg-purple-800'
              )}
              disabled={donateError || isDonating || (user.money < amount)}
            />
          </form>
        </div>
      </Modal>
    </>
  )
}