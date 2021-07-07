import { useState } from 'react'
import Modal from '@/components/common/Modal'
import { CogIcon, XIcon } from '@heroicons/react/outline'

export default function NewsModal() {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <button
        className="block px-4 py-2 mb-2 w-full text-indigo-300 text-sm font-semibold focus:outline-none hover:bg-indigo-700 rounded-lg"
        onClick={openModal}
      >
        <div className="flex flex-row items-center">
          <CogIcon className="w-5 h-5 mr-3" /> Settings
        </div>
      </button>

      <Modal
        open={isOpen}
        close={closeModal}
      >
        <div className="transition-all transform flex flex-col py-7 px-12 max-w-xl mx-6 md:mx-0 bg-white rounded-3xl shadow-xl">
          <button
            className="absolute top-0 right-0 m-4 focus:outline-none"
            onClick={closeModal}
          >
            <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" />
          </button>

          <div className="flex flex-col justify-center w-full">
            <div className="flex flex-col justify-center text-center mt-5 mb-3 z-20">
              <h3 className="font-semibold text-2xl text-indigo-700 uppercase tracking-widest mt-2 mb-4">
                CHANGE PASSWORD
              </h3>

              <p className="text-xl text-gray-600 mb-4"></p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}