import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
export default function itemlist({ symbol, price, change }) {

  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <div className='flex flex-row  my-8 w:11/12 md:w-full font-semibold text-lg '>
      {/* รายชื่อหมวดหมู่ */}
      <div className='flex-1 md:pl-4 2xl:pl-7 '>{symbol}</div>
      <div className='flex-1 md:pl-20 2xl:pl-52'>{price}</div>
      <div className='flex-1 text-white md:pl-4 2xl:pl-44'>
        <div className='bg-red-700 inline-block px-2 '>{change}%</div>
      </div>
      <div className='px-2 2xl:px-32 md:px-14'>
        <button
          type='button'
          onClick={openModal}
          className='flex-1 text-white'>
          <div className='rounded-xl bg-purple-400 hover:bg-purple-600 inline-block px-2  font-medium'>
            BUY
          </div>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="flex font-medium leading-6 text-gray-900 break-all"
                >
                  <div className='text-lg flex-1'>EMCL | 555 12 | 30%</div>
                  <div className='text-xs font-normal'>Avbi 6</div>
                </Dialog.Title>
                <div className="flex flex-col mt-2">
                  <div className='text-center mt-4'>
                    <input placeholder='Amount' className='text-center ring-2 ring-inset ring-black h-14' />
                  </div>
                  <div className='text-center my-5'>Total :5</div>
                  <div className="flex flex-row mt-4">
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-700 border border-transparent rounded-md hover:bg-green-800 "
                      onClick={closeModal}
                    >
                      Buy it
                    </button>
                    <div className='px-2'></div>
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-700 border border-transparent rounded-md hover:bg-red-800 "
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
