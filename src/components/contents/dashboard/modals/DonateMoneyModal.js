import { Dialog, Transition } from '@headlessui/react'
import { ChevronRightIcon, XIcon } from '@heroicons/react/outline'
import { useState, Fragment, useEffect } from 'react'
import Image from 'next/image'

import * as Util from '@/utils/common'
import useFetch from '@/hooks/useFetch'

import InputBox from '@/components/common/InputBox'
import AlertNotification from '@/components/common/AlertNotification'
import Button from '@/components/common/Button'
import Spinner from '@/components/common/Spinner'
import MoneyImage from '@/publics/money.png'

export default function DonateMoneyModal({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const [donate, setDonate] = useState('')
  const [isDonating, setIsDonating] = useState(false)
  const [donateDone, setDonateDone] = useState('')
  const [donateError, setDonateError] = useState('')

  useEffect(() => {
    // Revalidate while input donate and someone gives coin
    (donateError && ((donate) && (donate != 0) && (user.money >= donate))) && setDonateError('')
  })

  const openDialog = () => setIsOpen(true)
  const closeModal = () => { setIsOpen(false); setDonateError(''); setDonate(''); }

  const handleDonateChange = (e) => {
    const value = e.target.value

    if (isNaN(value) || parseInt(value) < 0) return

    setDonateError((value > user.money) ? 'Your coin is not enough' : '')
    setDonateDone(!donateError && '')
    setDonate(value)
  }

  const sendDonate = (e) => {
    e.preventDefault()

    if (!donate) {
      return setDonateError('Please insert your coin amount')
    }

    setIsDonating(true)

    useFetch('POST', `/api/users/${user._id}/transfer/coin`, { amount: donate })
      .then(async response => {
        if (response.status == 200) {
          setDonateDone(<>Donation successful <b>(-{Util.numberWithCommas(donate)} coin)</b></>)
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
        className="animate-ping p-1 hover:bg-purple-300 rounded-lg"
        onClick={openDialog}
      >
        <ChevronRightIcon className="text-purple-800 w-4 h-4" />
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          onClose={closeModal}
          className="fixed inset-0 z-10"
        >
          <div className="flex flex-col justify-center items-center h-screen">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-700 opacity-40" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="transition-all transform flex flex-col py-7 px-12 max-w-sm mx-6 md:mx-0 bg-white rounded-3xl shadow-xl">
                <div className="absolute top-0 right-0 p-4">
                  <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" onClick={closeModal} />
                </div>

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

                <form className="flex flex-row shadow-md mb-3 md:mb-1" onSubmit={sendDonate}>
                  <InputBox
                    type="text"
                    pattern="\d*"
                    style="flex-grow w-24 rounded-l-lg bg-purple-100 ring-1 ring-purple-200 focus:ring-purple-500 text-purple-800"
                    value={donate}
                    onChange={handleDonateChange}
                  />
                  
                  <Button
                    type="submit"
                    name={isDonating ? "DONATING" : "DONATE" }
                    icon={isDonating && <Spinner style="mr-2 w-3 h-3 text-white" />}
                    style={Util.concatClasses(
                      "inline-flex items-center justify-center px-3 bg-purple-700 rounded-r-lg ring-1 ring-purple-800 shadow-md font-semibold text-white text-sm disabled:opacity-50",
                      donateError ? 'cursor-not-allowed' : 'hover:bg-purple-800'
                    )}
                    disabled={donateError || isDonating}
                  />
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}