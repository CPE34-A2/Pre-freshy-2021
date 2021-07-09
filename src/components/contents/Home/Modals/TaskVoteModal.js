import { useEffect, useState } from 'react'
import Image from 'next/image'

import * as Util from '@/utils/common'
import fetchAPI from '@/utils/fetch'

import { XIcon, ChevronDoubleDownIcon, UserIcon } from '@heroicons/react/outline'
import { UserIcon as UserSolidIcon } from '@heroicons/react/solid'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import AlertNotification from '@/components/common/AlertNotification'

const showConfirmers = (confirmed, require) => {
  const confirmedExcludeLeader = confirmed.slice(1)
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

export default function TaskVoteModal({ user, clan, image, transaction, item, locale }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notification, notify] = useState({ type: '', info: '' })

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const vote = (isAccepted) => {
    fetchAPI(isAccepted ? 'PATCH' : 'DELETE', `/api/clans/${clan._id}/transfer/${item.type}`, {
      transaction_id: transaction._id,
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

  const isAlreadyAccepted = () => transaction.confirmer.includes(user._id)
  const isAlreadyRejected = () => (transaction.rejector.includes(user._id) && (user._id != clan.leader))
  const isAlreadyVote = () => (isAlreadyAccepted() || isAlreadyRejected())
  const isNotLeader = () => (user._id != clan.leader)

  useEffect(() => {
    isAlreadyAccepted() && notify({ type: 'success', info: <>You have <b>accepted</b> this transaction</> })
    isAlreadyRejected() && notify({ type: 'success', info: <>You have <b>rejected</b> this transaction</> })
  }, [transaction])

  return (
    <>
      <button
        className="font-bold rounded-lg w-full md:w-22 px-3 py-1 text-white bg-indigo-700 hover:bg-indigo-900 ring-1 hover:animate-pulse shadow-md hover:shadow-none focus:outline-none"
        onClick={openModal}
      >
        VOTE
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
              <Image src={image} alt="" />
            </div>

            <div className="bg-white w-32 h-32 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-14 z-10" />

            <div className="flex flex-col justify-center text-center mt-10 z-20">
              <h3 className="font-semibold text-lg text-gray-500 uppercase tracking-widest mt-2">Transaction Request</h3>

              <p className="font-bold text-3xl text-indigo-800 mt-8 uppercase">{item.cost} {locale.cost_unit}</p>
              <ChevronDoubleDownIcon className="mx-auto my-3 w-6 h-6 text-indigo-500 animate-bounce" />
              <p className="font-bold text-3xl text-indigo-800 mb-10 uppercase">{item.received} {locale.received_unit}</p>

              <div className="flex flex-row justify-between space-x-4 my-2">
                <div className="flex flex-col flex-grow">
                  <div className="flex flex-row justify-center space-x-2 mb-2">
                    {showConfirmers(transaction.confirmer, transaction.confirm_require)}
                  </div>

                  {user._id != clan.leader &&
                    <Button
                      type="button"
                      name="ACCEPT"
                      style={Util.concatClasses(
                        'bg-purple-300 text-purple-600 font-semibold py-1 w-full rounded-lg',
                        isAlreadyVote(transaction) ? 'cursor-not-allowed opacity-40' : 'hover:bg-purple-400 hover:text-purple-800'
                      )}
                      onClick={() => vote(true)}
                      disabled={isAlreadyVote(transaction)}
                    />
                  }
                </div>

                <div className="flex flex-col flex-grow">
                  <div className="flex flex-row justify-center space-x-2 mb-2">
                    {showRejectors(transaction.rejector, transaction.confirm_require)}
                  </div>

                  {user._id != clan.leader &&
                    <Button
                      type="button"
                      name="REJECT"
                      style={Util.concatClasses(
                        'bg-red-300 text-red-600 font-semibold py-1 w-full rounded-lg',
                        (isAlreadyVote(transaction) && isNotLeader()) ? 'cursor-not-allowed opacity-40' : 'hover:bg-red-400 hover:text-red-800',
                      )}
                      onClick={() => vote(false)}
                      disabled={isAlreadyVote(transaction) && isNotLeader()}
                    />
                  }
                </div>
              </div>

              {user._id == clan.leader &&
                <div className="flex flex-col mb-3">
                  <Button
                    type="button"
                    name="DISCARD"
                    style={Util.concatClasses(
                      'bg-red-300 text-red-600 font-semibold py-1 w-full rounded-lg',
                      (isAlreadyVote(transaction) && isNotLeader()) ? 'cursor-not-allowed opacity-40' : 'hover:bg-red-400 hover:text-red-800',
                    )}
                    onClick={() => vote(false)}
                    disabled={isAlreadyVote(transaction) && isNotLeader()}
                  />
                </div>
              }

              {user._id != clan.leader &&
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