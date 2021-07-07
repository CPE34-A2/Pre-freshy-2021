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
      <div className="transition-all transform flex flex-col py-4 px-9 max-w-sm mx-6 md:mx-0 bg-white rounded-3xl shadow-xl">
        <div className="flex flex-row">
          <div className="w-10 h-10">
            <Image src={image} alt="" />
          </div>
          <Dialog.Title as="h3">
            Planet Info
          </Dialog.Title>
          <button
            type="button"
            className="absolute top-0 right-0 m-4 focus:outline-none"
            onClick={close}
          >
            <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" />
          </button>
        </div>
        <div>Name: {planet.name}</div>
        <div>Tier: {planet.tier}</div>
        <div>Point: {planet.point}</div>
        <div>Travel Cost: {planet.travel_cost}</div>
        <div>Owner: {isBattle ? planet.owner : "None"}</div>
        {(planet.owner != clan._id && planet.tier != 'HOME') &&
          <div className="flex justify-center">
            <div onClick={openConfirmModal} ref={initialFocus} className="animate-pulse w-16 h-16">
              <Image src={isBattle ? Battle : Conquer} alt="" />
            </div>
          </div>
        }
        <PlanetConfirmModal planet={planet} closeAll={close} close={closeConfirmModal} isOpen={isClick} clan={clan} isBattle={isBattle} />
      </div>
    </Modal>
  )
}