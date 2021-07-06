import Image from 'next/image'
import { useState } from 'react' 
import Modal from "@/components/common/Modal"
import { Dialog } from '@headlessui/react'
import InputBox from '@/components/common/InputBox'
import fetchApi from '@/utils/fetch'

export default function PlanetConfirmModal({ planet, closeAll, clan, isOpen, close, isBattle }) {
  const [betInput, setBetInput] = useState({
    betMoney: 0,
    betFuel: 0,
  })
  
  const [betPlanetCheck, setBetPlanetCheck] = useState(new Array(clan.owned_planet_ids.length).fill(false))
  
  const handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    
    setBetInput({
      ...betInput,
      [name]: value
    })
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
      <label>
        {planet}
        <input 
          name={index}
          type="checkbox"
          onChange={handlePlanetChange}
        />
      </label>
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
        bet_money: betInput.betMoney,
        bet_fuel: betInput.betFuel,
        bet_planet_ids: mapIdsWithCheckBox(clan.owned_planet_ids, betPlanetCheck).toString()
      })
    } else {
      fetchApi('POST', `/api/clans/${clan._id}/transfer/planet`, {
        target_planet: planet._id
      })
    }
    closeAll()
  }

  return (
    <Modal
      open={isOpen}
      close={close}
    >
      <div className="transition-all transform flex flex-col py-7 px-12 max-w-sm mx-6 md:mx-0 bg-white rounded-3xl shadow-xl" >
        {isBattle &&
          <>
            <div>Battle</div>
            <form onSubmit={onAccept} className="flex flex-col">
              <InputBox
                name="betMoney"
                type="text"
                pattern="\d*"
                placeholder="Stake Money"
                onChange={handleInputChange}
              />
              <InputBox
                name="betFuel"
                type="text"
                pattern="\d*"
                placeholder="Stake Fuel"
                onChange={handleInputChange}
              />
              <div className="flex flex-row">
                Stake Planets:{planetList}
              </div>
              <div className="flex flex-row">
                <button type="submit">Confirm</button>
                <button type="reset" onClick={close}>Reject</button>
              </div>
            </form> 
          </>
        }
        {!isBattle &&
          <>
            <div>You Sure?</div>
            <div className="flex flex-row">
              <button onClick={onAccept}>Confirm</button>
              <button onClick={close}>Reject</button>
            </div>
          </>
        }
      </div>
    </Modal>
  )
}