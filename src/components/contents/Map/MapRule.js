import Modal from "@/components/common/Modal"
import { useRef } from "react"
import { XIcon } from '@heroicons/react/outline'
import { Dialog } from "@headlessui/react"

export default function MapRule({ isOpen, close }) {


  let initialFocus = useRef()

  return (
    <Modal
      open={isOpen}
      close={close}
      initialFocus={initialFocus}
    >
      <div className="transition-all transform flex flex-col py-7 px-9 max-w-xl mx-6 md:mx-0 bg-white rounded-3xl shadow-xl scale-75 md:scale-100">
        <div className="flex flex-row w-full justify-center">

          <div className="flex flex-row justify-center w-full">
            <Dialog.Title as="h3">
              <div className="font-bold text-lg z-20 text-indigo-800 tracking-wider">
                RULE OF THE UNIVERSE
              </div>
            </Dialog.Title>
          </div>
        </div>
        <div className="flex flex-col font-mono my-2 divide-y-2 w-60 space-y-2">
          <div className="font-medium">
            <div>1 coin = 0.5 planet point</div>
            <div>1 fuel = 1.5 planet point</div>
          </div>
          <div className="text-sm pt-2">
            <span className="font-semibold">Planet with shield indicates that the planet is either:</span>
            <div>1. Being visited.</div>
            <div>2. Being attacked.</div>
          </div>
          <div className="text-sm pt-2">
            <span className="font-semibold">Blinking planet indicates that the planet is either:</span>
            <div>1. The planet your clan is currently visiting.</div>
            <div>2. Your planet, and it&apos;s being attacked.</div>
          </div>
          <div className="text-sm pt-2 font-medium">Attacked planets can&apos;t be targeted for another attack for 24 hours (regardless of the result)</div>
        </div>
        <div>
          <button
            ref={initialFocus}
            type="button"
            onClick={close}
            className="bg-indigo-400 hover:bg-indigo-500 text-indigo-700 hover:text-indigo-900 font-semibold py-1 w-full rounded-xl focus:outline-none"
          >
            Understood
          </button>
        </div>
      </div>

    </Modal>

  )
}
