import { Fragment } from 'react'
import { Transition, Dialog } from '@headlessui/react'

export default function Modal({ children, open, close }) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        onClose={close}
        className="fixed inset-0 z-10"
      >
        <div className="flex flex-col justify-center items-center h-screen">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-700 opacity-70" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            
            {children}

          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}