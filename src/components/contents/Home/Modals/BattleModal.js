import { useEffect, useState } from 'react'
import Image from 'next/image'
import * as Util from '@/utils/common'
import fetchAPI from '@/utils/fetch'

import GallonImage from '@/publics/gallon.png'
import MoneyImage from '@/publics/money.png'
import StarImage from '@/publics/star.png'

import { XIcon } from '@heroicons/react/outline'
import { UserIcon } from '@heroicons/react/outline'
import { UserIcon as UserSolidIcon } from '@heroicons/react/solid'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import AlertNotification from '@/components/common/AlertNotification'

const showConfirmers = (confirmed, require, exclude) => {
  const confirmedExcludeLeader = confirmed.slice(exclude ? 1 : 0)
  const confirmers = []
  for (let i = 0; i < confirmedExcludeLeader.length; i++) {
    confirmers.push(<UserSolidIcon key={i} className="w-5 h-5 text-purple-600" />)
  }
  for (let i = 0; i < require - confirmedExcludeLeader.length; i++) {
    confirmers.push(<UserIcon key={i + confirmedExcludeLeader} className="w-5 h-5 text-purple-600" />)
  }
  return confirmers
}

const showRejectors = (rejected, require) => {
  const confirmers = []
  for (let i = 0; i < rejected.length; i++) {
    confirmers.push(<UserSolidIcon key={i} className="w-5 h-5 text-red-600" />)
  }
  for (let i = 0; i < require - rejected.length; i++) {
    confirmers.push(<UserIcon key={i + rejected.length} className="w-5 h-5 text-red-600" />)
  }
  return confirmers
}

export default function BattleModal({ user, phaseData, isLeader, planet, img, targetClanName }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notification, notify] = useState({ type: '', info: '' })

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const vote = (isAccepted) => {
    fetchAPI(isAccepted ? 'PATCH' : 'DELETE', `/api/clans/${user.clan_id}/battle/phase0${phaseData.current}`, {
      battle_id: phaseData.id,
    })
      .then(async response => {
        const data = await response.json()
        if (response.status == 200) {
          notify({ type: 'success', info: `Request ${isAccepted ? 'Accepted' : 'Rejected'}` })
        } else {
          notify({ type: 'error', info: data.message })
        }
      })
  }

  if (phaseData.current != 0) {
    var isAlreadyAccepted = () => phaseData.confirmer.includes(user._id)
    var isAlreadyRejected = () => (phaseData.rejector.includes(user._id) && !isLeader)
    var isAlreadyVote = () => (isAlreadyAccepted() || isAlreadyRejected())

    useEffect(() => {
      isAlreadyAccepted() && notify({ type: 'success', info: <>You have <b>accepted</b> this pending</> })
      isAlreadyRejected() && notify({ type: 'success', info: <>You have <b>rejected</b> this pending</> })
    }, [phaseData])
  }

  if (phaseData.current == 0) {
    return (
      <>
        <button
          className="bg-indigo-700 hover:bg-indigo-800 px-4 py-1 text-white text-sm font-medium rounded-lg w-full focus:outline-none"
          onClick={openModal}
        >
          VIEW MORE
        </button>

        <Modal
          open={isOpen}
          close={closeModal}
        >
          <div className="transition-all transform flex flex-col py-7 px-12 max-w-md mx-6 md:mx-0 bg-white rounded-3xl shadow-xl">
            <button
              className="absolute top-0 right-0 m-4 focus:outline-none"
              onClick={closeModal}
            >
              <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" />
            </button>

            <div className="flex flex-col justify-center w-56 md:w-72">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-11 mx-auto w-24 h-24 z-20">
                <Image className={img.color} src={img.src} alt="" />
              </div>

              <div className="bg-white w-32 h-32 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-14 z-10" />

              <div className="flex flex-col justify-center text-center mt-3 z-20">
                {phaseData.current != 0 && (
                  <h3 className="font-semibold text-base text-gray-500 uppercase tracking-widest mt-2">
                    {phaseData.isAttackerIsMe ? 'DECLARE WAR TO' : 'INCOMING ATTACK'}
                  </h3>
                )}
                <h4 className="font-bold text-xl tracking-wide text-indigo-900">{targetClanName}</h4>

                <div className="flex flex-row space-x-5 justify-around mt-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 mb-2">
                      <Image src={MoneyImage} alt="" />
                    </div>
                    <div className="font-extrabold text-lg text-indigo-900">
                      {Util.numberWithCommas(planet.stakes.money)} <span className="text-gray-800 font-medium">coin</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 mb-2">
                      <Image src={GallonImage} alt="" />
                    </div>
                    <div className="font-extrabold text-lg text-indigo-900">
                      {Util.numberWithCommas(planet.stakes.fuel)} <span className="text-gray-800 font-medium">gallon</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center mt-2 mb-3">
                  <div className="w-12 h-12 mb-2">
                    <Image src={StarImage} alt="" />
                  </div>
                  <div className="font-extrabold text-lg text-indigo-900">
                    {planet.stakes.planet_ids.length} <span className="text-gray-800 font-medium">star</span>
                  </div>

                  {planet.stakes.planet_ids.length != 0 && (
                    <div className="tracking-wider leading-none text-sm text-gray-500">
                      ({planet.stakes.planet_ids.toString()})
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </>
    )
  }

  return (
    <>
      <button
        className="bg-indigo-700 hover:bg-indigo-800 px-4 py-1 text-white text-sm font-medium rounded-lg w-full focus:outline-none"
        onClick={openModal}
      >
        VIEW MORE
      </button>

      <Modal
        open={isOpen}
        close={closeModal}
      >
        <div className="transition-all transform flex flex-col py-7 px-12 max-w-md mx-6 md:mx-0 bg-white rounded-3xl shadow-xl">
          <button
            className="absolute top-0 right-0 m-4 focus:outline-none"
            onClick={closeModal}
          >
            <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" />
          </button>

          <div className="flex flex-col justify-center w-56 md:w-72">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-11 mx-auto w-24 h-24 z-20">
              <Image className={img.color} src={img.src} alt="" />
            </div>

            <div className="bg-white w-32 h-32 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-14 z-10" />

            <div className="flex flex-col justify-center text-center mt-3 z-20">
              <h3 className="font-semibold text-base text-gray-500 uppercase tracking-widest mt-2">
                {phaseData.isAttackerIsMe ? 'DECLARE WAR TO' : 'INCOMING ATTACK'}
              </h3>
              <h4 className="font-bold text-xl tracking-wide text-indigo-900">{targetClanName}</h4>

              <div className="flex flex-row space-x-5 justify-around mt-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mb-2">
                    <Image src={MoneyImage} alt="" />
                  </div>
                  <div className="font-extrabold text-lg text-indigo-900">
                    {Util.numberWithCommas(planet.stakes.money)} <span className="text-gray-800 font-medium">coin</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mb-2">
                    <Image src={GallonImage} alt="" />
                  </div>
                  <div className="font-extrabold text-lg text-indigo-900">
                    {Util.numberWithCommas(planet.stakes.fuel)} <span className="text-gray-800 font-medium">gallon</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center mt-2 mb-3">
                <div className="w-12 h-12 mb-2">
                  <Image src={StarImage} alt="" />
                </div>
                <div className="font-extrabold text-lg text-indigo-900">
                  {planet.stakes.planet_ids.length} <span className="text-gray-800 font-medium">star</span>
                </div>

                {planet.stakes.planet_ids.length != 0 && (
                  <div className="tracking-wider leading-none text-sm text-gray-500">
                    ({planet.stakes.planet_ids.toString()})
                  </div>
                )}
              </div>

              {((phaseData.isAttackerIsMe && phaseData.current == 1) || (!phaseData.isAttackerIsMe && phaseData.current == 2)) &&
                <div className="flex flex-row justify-between space-x-4 my-2">
                  <div className="flex flex-col flex-grow">
                    <div className="flex flex-row justify-center space-x-2 mb-2">
                      {showConfirmers(phaseData.confirmer, phaseData.confirm_require, (phaseData.isAttackerIsMe && phaseData.current == 1))}
                    </div>

                    {((!isLeader && phaseData.current == 1) || (phaseData.current == 2)) &&
                      <Button
                        type="button"
                        name="ACCEPT"
                        style={Util.concatClasses(
                          'bg-purple-300 text-purple-600 font-semibold py-1 w-full rounded-lg',
                          isAlreadyVote(phaseData) ? 'cursor-not-allowed opacity-40' : 'hover:bg-purple-400 hover:text-purple-800'
                        )}
                        onClick={() => vote(true)}
                        disabled={isAlreadyVote(phaseData)}
                      />
                    }
                  </div>

                  <div className="flex flex-col flex-grow">
                    <div className="flex flex-row justify-center space-x-2 mb-2">
                      {showRejectors(phaseData.rejector, phaseData.confirm_require)}
                    </div>

                    {((!isLeader && phaseData.current == 1) || (phaseData.current == 2)) &&
                      <Button
                        type="button"
                        name="REJECT"
                        style={Util.concatClasses(
                          'bg-red-300 text-red-600 font-semibold py-1 w-full rounded-lg',
                          (isAlreadyVote(phaseData) && (!isLeader && (phaseData.current == 1))) ? 'cursor-not-allowed opacity-40' : 'hover:bg-red-400 hover:text-red-800',
                        )}
                        onClick={() => vote(false)}
                        disabled={isAlreadyVote(phaseData) && (!isLeader && (phaseData.current == 1))}
                      />
                    }
                  </div>
                </div>
              }

              {(isLeader && ((phaseData.isAttackerIsMe && phaseData.current == 1))) &&
                <div className="flex flex-col mb-3">
                  <Button
                    type="button"
                    name="DISCARD"
                    style={Util.concatClasses(
                      'bg-red-300 text-red-600 font-semibold py-1 w-full rounded-lg',
                      (isAlreadyVote(phaseData) && !isLeader) ? 'cursor-not-allowed opacity-40' : 'hover:bg-red-400 hover:text-red-800',
                    )}
                    onClick={() => vote(false)}
                    disabled={isAlreadyVote(phaseData) && !isLeader}
                  />
                </div>
              }

              {!isLeader &&
                <AlertNotification
                  type={notification.type}
                  info={notification.info}
                  style="mb-3"
                />
              }
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}