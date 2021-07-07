import Modal from "@/components/common/Modal"
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import PlanetConfirmModal from './PlanetConfirmModal'
import Conquer from '@/publics/conquer.png'
import Battle from '@/publics/battle.png'
import Image from "next/image"
import { useState, useRef } from 'react'

export default function PlanetModal({ clan, planet, image, isOpen, close }) {
  const [isClick, setIsClick] = useState(false)
  const isBattle = planet.owner != 0 ? true : false

  const openConfirmModal = () => setIsClick(true)
  const closeConfirmModal = () => setIsClick(false)

  let initialFocus = useRef(null)

  return (
    <Modal
      open={isOpen}
      close={close}
      initialFocus={initialFocus}
    >
      <div className="transition-all transform flex flex-col py-8 px-9 max-w-xl mx-6 md:mx-0 bg-white rounded-3xl shadow-xl scale-75 md:scale-100">
        <div className="flex flex-row w-full justify-center">

          <div className="flex flex-row items-center justify-center w-full">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-14 mx-auto w-24 h-24 z-20">
              <Image src={image} alt="" />
            </div>

            <div className="bg-white w-28 h-28 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 z-10" />

            <Dialog.Title as="h3">
              <div className="font-bold text-xl z-20 mt-6 text-indigo-800 tracking-wider">
                PLANET INFO
              </div>
            </Dialog.Title>
          </div>

          <button
            type="button"
            className="absolute top-0 right-0 m-4 focus:outline-none"
            onClick={close}
          >
            <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" />
          </button>
        </div>

        <div className="flex flex-col my-4 text-center px-4">
          <div className="flex flex-row space-x-6 divide-x-2">
            <div className="">
              <div className="text-gray-500 text-lg">Name</div>
              <div className="font-semibold text-xl">{planet.name}</div>
            </div>

            <div className="">
              <div className="text-gray-500 text-lg ml-6">Tier</div>
              <div className="font-semibold text-xl ml-6">{planet.tier}</div>
            </div>

            <div className="">
              <div className="text-gray-500 text-lg ml-6">Point</div>
              <div className="font-semibold text-xl ml-6">{planet.point}</div>
            </div>

            <div className="">
              <div className="text-gray-500 text-lg ml-6">Travel Cost</div>
              <div className="font-semibold text-xl ml-6">{planet.travel_cost}</div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <div className="">
              <div className="text-gray-500 text-lg">Owner</div>
              <div className="font-semibold text-xl">{isBattle ? planet.owner : 'None'}</div>
            </div>
          </div>
        </div>

        {(planet.owner != clan._id && planet.tier != 'HOME') &&
          <div className="flex justify-center mt-4">
            <div onClick={openConfirmModal} ref={initialFocus} className="animate-pulse transition duration-150 ease-in-out hover:animate-none hover:scale-110 w-20 h-20 hover:cursor-pointer drop-shadow-md">
              <Image src={isBattle ? Battle : Conquer} alt="" />
            </div>
          </div>
        }
        <PlanetConfirmModal planet={planet} closeAll={close} close={closeConfirmModal} isOpen={isClick} clan={clan} isBattle={isBattle} />
      </div>
    </Modal>
  )
}