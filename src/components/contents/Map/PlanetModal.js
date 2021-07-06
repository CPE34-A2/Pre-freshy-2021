import Modal from "@/components/common/Modal"
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import PlanetConfirmModal from './PlanetConfirmModal'
import Conquer from '@/publics/conquer.png'
import Battle from '@/publics/battle.png'
import Image from "next/image"
import { useState } from 'react' 

export default function PlanetModal({ clan, planet, image, isOpen, close }) {
  const [isClick, setIsClick] = useState(false)
  const isBattle = planet.owner != 0 ? true : false

  const openConfirmModal = () => setIsClick(true)
  const closeConfirmModal = () => setIsClick(false)
  

  return (
    <Modal
      open={isOpen}
      close={close}
    >
      <div className="transition-all transform flex flex-col py-7 px-12 max-w-sm mx-6 md:mx-0 bg-white rounded-3xl shadow-xl">
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
        <div className="flex flex-col justify-center" onClick={openConfirmModal} >
          <Image src={isBattle ? Battle : Conquer} alt="" />
        </div>
        <PlanetConfirmModal planet={planet} closeAll={close} close={closeConfirmModal} isOpen={isClick} clan={clan} isBattle={isBattle} />
      </div>
    </Modal>
  )
}