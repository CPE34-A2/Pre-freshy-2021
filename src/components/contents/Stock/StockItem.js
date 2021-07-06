import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import * as Util from '@/utils/common'
import AlertNotification from '@/components/common/AlertNotification'
import fetchAPI from '@/utils/fetch'

export default function StockItem({ clan, data }) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [notification, notify] = useState({ type: '', info: '' })

  function closeModal() {
    setIsOpen(false)
    setAmount('')
    notify({ type: '', info: '' })
  }

  function openModal() {
    setIsOpen(true)
  }

  const handleChange = (e) => {
    const value = e.target.value

    // Prevent user to input non-integer, starts with 0 and negative integer
    const isNotInteger = !(/^\+?(0|[1-9]\d*)$/.test(value))
    const isStartsWithZero = (/^0/.test(value))

    if (isNaN(value) || isStartsWithZero || (value && isNotInteger) || parseInt(value) < 0) return

    if (value > clan.properties.money) {
      notify({ type: 'error', info: `Your clan's coin is not enough` })
    } else {
      notify({ type: '', info: '' })
    }

    setAmount(value)
  }

  const openTransaction = (method, symbol, amount) => {
    fetchAPI('POST', `/api/clans/${clan._id}/transfer/stock`, {
      method: method, symbol: symbol, amount: amount
    })
      .then(async response => {
        const data = await response.json()
        if (response.status == 200) {
          notify({ type: 'success', info: `${method} ${amount} ${symbol} successful` })
        } else {
          notify({ type: 'error', info: data.message })
        }
      })
  }

  const buy = () => openTransaction('Buy', data.symbol, amount)
  const sell = () => openTransaction('Sell', data.symbol, amount)

  return (
    <div className='flex flex-row  my-8 w:11/12 md:w-full font-semibold text-lg '>
      {/* รายชื่อหมวดหมู่ */}
      <div className='flex-1 font-bold md:pl-4 2xl:pl-7 '>{data.symbol}</div>
      <div 
        className={Util.concatClasses(
          'flex-1 md:pl-20 2xl:pl-52 font-bold',
          data.changed > 0 && 'text-green-700',
          data.changed < 0 && 'text-red-600',
          data.changed == 0 && 'text-black'
        )}
      >
        {data.rate}
      </div>
      <div className='flex-1 text-white md:pl-4 2xl:pl-44'>
        <div
          className={Util.concatClasses(
            'inline-block px-2 rounded-lg',
            data.changed > 0 && 'bg-green-700',
            data.changed < 0 && 'bg-red-600',
            data.changed == 0 && 'text-black'
          )}
        >
          {data.changed > 0 && '+'}{data.changed}
        </div>
      </div>
      <div className='px-2 2xl:px-32 md:px-14'>
        <button
          type='button'
          onClick={openModal}
          className='flex-1 text-white'>
          <div className='rounded-xl bg-indigo-600 hover:bg-indigo-800 inline-block px-2 font-medium'>
            BUY / SELL
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
                  <div className='text-lg flex-1 space-x-2'>
                    <span className="font-bold">{data.symbol} | </span>
                    <span className="font-bold">{data.rate}</span>
                    <span
                      className={Util.concatClasses(
                        'font-bold',
                        data.changed >= 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      ({data.changed > 0 && '+'}{data.changed})
                    </span>
                  </div>
                  <div className='text-sm font-bold'>OWNED: {clan.properties.stocks[data.symbol]} {data.symbol}</div>
                </Dialog.Title>
                <div className="flex flex-col mt-2">
                  <div className='text-center mt-4'>
                    <input
                      type="text"
                      pattern="\d*"
                      value={amount}
                      placeholder={`Amount (${data.symbol})`}
                      className='text-center ring-2 ring-inset ring-black h-14'
                      onChange={handleChange}
                    />
                  </div>
                  <div className='text-center my-5'>Total: <span className="font-bold">{Util.numberWithCommas(amount * data.rate)}</span></div>

                  <AlertNotification
                    type={notification.type}
                    info={notification.info}
                  />

                  <div className="flex flex-row mt-4">
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-700 border border-transparent rounded-md hover:bg-green-800 "
                      onClick={buy}
                    >
                      BUY
                    </button>
                    <div className='px-2'></div>
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-700 border border-transparent rounded-md hover:bg-red-800 "
                      onClick={sell}
                    >
                      SELL
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