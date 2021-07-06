import { useState } from 'react'
import { XIcon } from '@heroicons/react/outline'
import Image from 'next/image'

import * as Util from '@/utils/common'
import fetchAPI from '@/utils/fetch'

import GallonImage from '@/publics/gallon.png'
import Modal from '@/components/common/Modal'
import InputBox from '@/components/common/InputBox'
import AlertNotification from '@/components/common/AlertNotification'
import Button from '@/components/common/Button'
import Spinner from '@/components/common/Spinner'

export default function BuyFuelModal({ clan }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const [amount, setAmount] = useState('')
  const [notification, notify] = useState({ type: '', info: '' })

  const clearNotification = () => notify({ type: '', info: '' })
  const openModal = () => setIsOpen(true)
  const closeModal = () => { setIsOpen(false); setAmount(''); clearNotification(); }

  const handleAmountChange = (e) => {
    const value = e.target.value

    // Prevent user to input non-integer, starts with 0 and negative integer
    const isNotInteger = !(/^\+?(0|[1-9]\d*)$/.test(value))
    const isStartsWithZero = (/^0/.test(value))

    if (isNaN(value) || isStartsWithZero || (value && isNotInteger) || parseInt(value) < 0) return

    if (clan.properties.money < (value * clan.fuel_rate)) {
      notify({ type: 'error', info: 'Your coin is not enough' })
    } else {
      clearNotification()
    }

    setAmount(value)
  }

  const buyFuel = (e) => {
    e.preventDefault()

    setIsBuying(true)
    clearNotification()

    fetchAPI('POST', `/api/clans/${clan._id}/transfer/fuel`, { amount: amount })
      .then(async response => {
        if (response.status == 200) {
          notify({ type: 'success', info: <>Wait for confimation <b>({amount * clan.fuel_rate} coin)</b></> })
        } else {
          const data = await response.json()
          notify({ type: 'error', info: data.message })
        }
      })
      .finally(() => {
        setIsBuying(false)
      })
  }

  return (
    <>
      <button
        className={Util.concatClasses(
          "font-semibold text-white bg-indigo-700 hover:bg-indigo-900 px-2 hover:shadow-none shadow-md rounded-lg focus:outline-none ml-0 sm:ml-4 xl:ml-0",
          (clan.properties.money >= clan.fuel_rate) && 'animate-pulse'
        )}
        onClick={openModal}
      >
        BUY
      </button>

      <Modal
        open={isOpen}
        close={closeModal}
      >
        <div className="transition-all transform flex flex-col py-7 px-12 max-w-md mx-6 md:mx-0 bg-white rounded-3xl shadow-xl">
          <button
            type="button"
            className="absolute top-0 right-0 m-4 focus:outline-none"
            onClick={closeModal}
          >
            <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" />
          </button>

          <div className="flex flex-col justify-center w-56 md:w-72">
            <div className="flex flex-row items-center bg-purple-100 rounded-lg px-4 py-2">
              <div className="w-14 h-14">
                <Image src={GallonImage} alt="" />
              </div>
              <div className="ml-3 leading-none">
                <div className="font-bold text-purple-900 text-lg">Starship fuel</div>
                <div className="font-light text-purple-700 text-sm">premium fluid</div>
              </div>
            </div>

            <div className="flex flex-col my-6">
              <div className="flex flex-row justify-between mb-2">
                <div className="font-bold">
                  Detail
                </div>
              </div>

              {/* Detail for decoration */}
              <div className="flex flex-row justify-between">
                <div className="text-gray-500 text-sm font-semibold">Fuel</div>
                <div className="text-gray-500 font-semibold">1 coin</div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="text-gray-500 text-sm font-semibold">Services Fee</div>
                <div className="text-gray-500 font-semibold">1 coin</div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="text-gray-500 text-sm font-semibold">Space TAX</div>
                <div className="text-gray-500 font-semibold">1 coin</div>
              </div>
              <div className="flex flex-row justify-between mb-3">
                <div className="text-gray-700 text-sm font-semibold">Price / unit</div>
                <div className="text-gray-700 font-semibold">{clan.fuel_rate} coin</div>
              </div>

              {/* Payment detail */}
              <div className="flex flex-row justify-between pt-3 border-t-2">
                <div className="text-gray-700 text-sm font-semibold">Amount</div>
                <div className="text-gray-700 font-semibold">
                  {Util.numberWithCommas(amount || 0)} unit
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="text-gray-700 text-sm font-semibold">Total payment</div>
                <div className="font-bold text-purple-700">
                  {Util.numberWithCommas(amount * clan.fuel_rate)} coin
                </div>
              </div>
            </div>

            <AlertNotification
              type={notification.type}
              info={notification.info}
              style="mb-3"
            />

            <form className="flex flex-row drop-shadow-md mb-3 md:mb-1" onSubmit={buyFuel}>
              <InputBox
                type="text"
                maxLength="7"
                pattern="\d*"
                style="flex-grow w-24 rounded-l-lg bg-purple-100 ring-1 ring-purple-200 focus:ring-purple-500 text-purple-800"
                value={amount}
                onChange={handleAmountChange}
              />
              <Button
                type="submit"
                name={isBuying ? "BUYING" : "BUY"}
                icon={isBuying && <Spinner style="mr-2 w-3 h-3 text-white" />}
                style={Util.concatClasses(
                  "inline-flex items-center justify-center px-3 bg-purple-700 rounded-r-lg ring-1 ring-purple-800 shadow-md font-semibold text-white text-sm disabled:opacity-50",
                  ((notification.type == 'error')) || (clan.properties.money < (amount * clan.fuel_rate)) ? 'cursor-not-allowed' : 'hover:bg-purple-800'
                )}
                disabled={(notification.type == 'error') || isBuying || (clan.properties.money < (amount * clan.fuel_rate))}
              />
            </form>
          </div>
        </div>
      </Modal>
    </>
  )
}