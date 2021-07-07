import { useState } from 'react'
import { Switch } from '@headlessui/react'
import Modal from '@/components/common/Modal'
import { XIcon } from '@heroicons/react/outline'

export default function NewsModal({ img, title, content }) {
  const [isEnglish, setEnglish] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => { setIsOpen(true); setEnglish(false) }
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <button
        className="bg-indigo-700 py-1 w-full text-center rounded-xl text-light text-white text-lg focus:outline-none"
        onClick={openModal}
      >
        Continue Reading
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

          <div className="absolute top-0 left-0 m-5 flex items-center justify-center">
            <span className="mr-2 text-sm font-medium text-indigo-700">TH</span>
            <Switch
              checked={isEnglish}
              onChange={setEnglish}
              className='bg-gray-300 inline-flex items-center h-6 rounded-full w-11 focus:outline-none'
            >
              <span
                className={`${isEnglish ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full`}
              />
            </Switch>
            <span className="ml-2 text-sm font-medium text-indigo-700">EN</span>
          </div>

          <div className="flex flex-col justify-center w-full">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-20 mx-auto w-32 h-32 z-20">
              {img}
            </div>

            <div className="bg-white w-32 h-32 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-20 z-10" />

            <div className="flex flex-col justify-center text-center mt-5 mb-3 z-20">
              <h3 className="font-semibold text-2xl text-indigo-700 uppercase tracking-normal mt-2 mb-4">{title}</h3>

              <p className="text-xl text-gray-600 mb-4">{isEnglish ? content[1] : content[0]}</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}