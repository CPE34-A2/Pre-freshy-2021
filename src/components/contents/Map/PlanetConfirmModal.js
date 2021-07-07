import Image from 'next/image'
import { useState, useRef } from 'react'
import Modal from "@/components/common/Modal"
import { Dialog } from '@headlessui/react'
import InputBox from '@/components/common/InputBox'
import fetchApi from '@/utils/fetch'
import AlertNotification from '@/components/common/AlertNotification'

export default function PlanetConfirmModal({ planet, closeAll, clan, isOpen, close, isBattle }) {
  const [betMoney, setBetMoney] = useState('')
  const [betFuel, setBetFuel] = useState('')
  const [betPlanetCheck, setBetPlanetCheck] = useState(new Array(clan.owned_planet_ids.length).fill(false))
  const [notification, notify] = useState({ type: '', info: '' })

  const clearNotification = () => notify({ type: '', info: '' })

  const handleMoneyChange = (e) => {
    const target = e.target;
    const value = target.value

    // Prevent user to input non-integer, starts with 0 and negative integer
    const isNotInteger = !(/^\+?(0|[1-9]\d*)$/.test(value))
    const isStartsWithZero = (/^0/.test(value))

    if (isNaN(value) || isStartsWithZero || (value && isNotInteger) || parseInt(value) < 0) return

    if (clan.properties.money < value || clan.properties.fuel < betFuel) {
      notify({ type: 'error', info: 'Your assets is not enough' })
    } else {
      clearNotification()
    }

    setBetMoney(value)
  }

  const handleFuelChange = (e) => {
    const target = e.target;
    const value = target.value

    // Prevent user to input non-integer, starts with 0 and negative integer
    const isNotInteger = !(/^\+?(0|[1-9]\d*)$/.test(value))
    const isStartsWithZero = (/^0/.test(value))

    if (isNaN(value) || isStartsWithZero || (value && isNotInteger) || parseInt(value) < 0) return

    if (clan.properties.fuel < value || clan.properties.money < betMoney) {
      notify({ type: 'error', info: 'Your assets is not enough' })
    } else {
      clearNotification()
    }

    setBetFuel(value)
  }

  const handlePlanetChange = (e) => {
    const target = e.target
    const value = target.checked
    const index = target.name
    const newPlanets = betPlanetCheck.slice()
    newPlanets[index] = value

    setBetPlanetCheck(newPlanets)
  }

  const planetList = clan.owned_planet_ids.map((planet, index) => {
    return (
      <div className="flex flex-row">
        <div className="mr-2">
          <input
            name={index}
            type="checkbox"
            onChange={handlePlanetChange}
          />
        </div>
        <div className="font-semibold">
          {planet}
        </div>
      </div>
    )
  })

  const mapIdsWithCheckBox = (planets, checkboxes) => {
    return planets.filter((planet, index) => {
      return checkboxes[index]
    })
  }

  const onAccept = (e) => {
    e.preventDefault()
    if (isBattle) {
      fetchApi('POST', `/api/clans/${clan._id}/battle/phase01`, {
        target_planet: planet._id,
        bet_money: betMoney,
        bet_fuel: betFuel,
        bet_planet_ids: mapIdsWithCheckBox(clan.owned_planet_ids, betPlanetCheck).toString()
      })
    } else {
      fetchApi('POST', `/api/clans/${clan._id}/transfer/planet`, {
        target_planet: planet._id
      })
    }
    closeAll()
  }

  let initialFocus = useRef(null)

  return (
    <Modal
      open={isOpen}
      close={close}
      initialFocus={initialFocus}
    >
      <div className="transition-all transform flex flex-col py-7 px-12 max-w-sm mx-6 md:mx-0 bg-white rounded-3xl shadow-xl" >
        {isBattle &&
          <>
            <div className="text-xl font-bold text-purple-900 text-center mb-4 tracking-widest">BATTLE</div>
            <form onSubmit={onAccept} autocomplete="off" className="flex flex-col">
              <InputBox
                name="betMoney"
                ref={initialFocus}
                type="text"
                pattern="\d*"
                placeholder="Stake Money"
                style="mb-2 rounded-lg ring-gray-400"
                onChange={handleMoneyChange}
                value={betMoney}
              />
              <InputBox
                name="betFuel"
                type="text"
                pattern="\d*"
                placeholder="Stake Fuel"
                style="mb-2 rounded-lg ring-gray-400"
                onChange={handleFuelChange}
                value={betFuel}
              />
              <div className="flex flex-row">
                <div className="text-gray-500">Stake Planets:</div>
                <div className="ml-2">
                  {planetList}
                </div>
              </div>

              <AlertNotification
                type={notification.type}
                info={notification.info}
                style="mb-3"
              />

              <div className="flex flex-row space-x-4 mt-4">
                <button
                  type="submit"
                  className="bg-purple-300 hover:bg-purple-400  text-purple-600 hover:text-purple-800 font-semibold py-1 w-full rounded-xl focus:outline-none"
                >
                  Confirm
                </button>
                <button
                  type="reset"
                  onClick={close}
                  className="bg-red-300 hover:bg-red-400 text-red-600 hover:text-red-800 font-semibold py-1 w-full rounded-xl focus:outline-none"
                >
                  Reject
                </button>
              </div>
            </form>
          </>
        }
        {!isBattle &&
          <>
            <div className="text-lg font-semibold text-purple-900 text-center">Do you want to conquer this planet?</div>
            <div className="flex flex-row mt-4 space-x-4">
              <button
                ref={initialFocus}
                onClick={onAccept}
                className="bg-purple-300 hover:bg-purple-400 text-purple-600 hover:text-purple-800 font-semibold py-1 w-full rounded-xl focus:outline-none"
              >
                Confirm</button>
              <button
                onClick={close}
                className="bg-red-300 hover:bg-red-400 text-red-600 hover:text-red-800 font-semibold py-1 w-full rounded-xl focus:outline-none"
              >
                Reject
              </button>
            </div>
          </>
        }
      </div>
    </Modal>
  )
}