import Modal from "@/components/common/Modal"
import { Dialog } from '@headlessui/react'
import { ChevronRightIcon, XIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import Conquer from '@/publics/conquer.png'
import Battle from '@/publics/battle.png'

export default function PlanetModal({ planet, image, isOpen, close }) {
  return (
    <Modal
      open={isOpen}
      close={close}
    >
      <div className="transition-all transform flex flex-col py-7 px-12 max-w-sm mx-6 md:mx-0 bg-white rounded-3xl shadow-xl">
        <div className="flex flex-row">
          <div className="w-10 h-10">
            <Image src={image} alt=""/>
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
        <div>Owner: {planet.owner != 0 ? planet.owner : "None"}</div>
        <div>
          {planet.owner == 0
            ? <Image src={Conquer} />
            : <Image src={Battle} />
          }
        </div>
      </div>
    </Modal>
  )
}