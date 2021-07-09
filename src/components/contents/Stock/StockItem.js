import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import Modal from '@/components/common/Modal'
import * as Util from '@/utils/common'
import AlertNotification from '@/components/common/AlertNotification'
import fetchAPI from '@/utils/fetch'
import { XIcon } from '@heroicons/react/outline'

const symbolFullName = {
  MINT: 'MazdaIsusuNissanToyota',
  MALP: 'MangoAppleLemonPapaya',
  ECML: 'EspressoCappucinoMoccaLatte',
  HCA: 'HouseCondoApartment',
  LING: 'LuffyIchigoNarutoGoku'
}

const Delta = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="currentColor" d="M24 22h-24l12-20z" />
  </svg>
)

export default function StockItem({ clan, data, open }) {
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

    if (value > 1000000) return

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
    <div className="flex flex-row justify-between items-center border-b py-4 border-gray-700">
      <div className="flex flex-row h-full items-stretch">
        <span className={Util.concatClasses(
          "flex mr-4 w-1.5 rounded-lg my-0 md:my-3",
          data.changed < 0 && 'bg-red-700',
          data.changed > 0 && 'bg-green-700',
          data.changed == 0 && 'bg-gray-300'
        )} />
        <div className="flex flex-col justify-center">
          <div className="font-bold text-xl stock-text-5">{data.symbol}</div>
          <div className="font-normal text-xs stock-text-6">{symbolFullName[data.symbol]}</div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="font-bold text-xl stock-text-5">
          {Util.numberWithCommas(data.rate)}.00
        </div>
        <div className={Util.concatClasses(
          'flex flex-col transform ',
          data.changed < 0 && 'text-red-500',
          data.changed > 0 && 'text-green-600'
        )}>
          <div className="flex flex-row items-center text-base font-bold leading-none">
            {data.changed != 0 && <Delta className={Util.concatClasses('w-2 h-2 mr-1', data.changed < 0 && 'rotate-180 mt-1')} />}

            {(data.changed != 0) ?
              (<span>{data.changed}.00 ({Number.parseFloat((Math.abs(data.changed) / (data.rate - data.changed)) * 100).toFixed(2)}%)</span>) :
              (<span className="stock-text-6">- (0.00%)</span>)
            }
          </div>
        </div>

        {open ? (
          <>
            <button
              className={Util.concatClasses(
                'text-sm mt-2 mb-3 font-medium hover:text-white',
                data.changed < 0 && 'text-gray-100 bg-red-700 hover:bg-red-800 rounded-lg px-2',
                data.changed > 0 && 'text-gray-100 bg-green-700 hover:bg-green-800 rounded-lg px-2',
                data.changed == 0 && 'text-gray-100 bg-gray-500 hover:bg-gray-600 rounded-lg px-2'
              )}
              onClick={openModal}
            >
              BUY/SELL
            </button>

            <Modal
              open={isOpen}
              close={closeModal}
            >
              <div className="transition-all transform flex flex-col py-7 px-12 w-full max-w-xs sm:max-w-md stock-bg bg-opacity-90 rounded-3xl shadow-xl">
                <button
                  type="button"
                  className="absolute top-0 right-0 m-4 focus:outline-none"
                  onClick={closeModal}
                >
                  <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-800" />
                </button>

                <Dialog.Title
                  as="h3"
                  className="flex font-medium leading-6 text-gray-900 break-all"
                >
                  <div className='text-lg flex flex-row items-center space-x-4'>
                    <span className="font-bold stock-text-6">{data.symbol}</span>

                    <div className={Util.concatClasses(
                      'flex flex-col transform ',
                      data.changed < 0 && 'text-red-500',
                      data.changed > 0 && 'text-green-600'
                    )}>
                      <div className="flex flex-row items-center text-base font-bold leading-none">
                        {data.changed != 0 && <Delta className={Util.concatClasses('w-2 h-2 mr-1', data.changed < 0 && 'rotate-180 mt-1')} />}

                        {(data.changed != 0) ?
                          (<span>{data.changed}.00 ({Number.parseFloat((Math.abs(data.changed) / (data.rate - data.changed)) * 100).toFixed(2)}%)</span>) :
                          (<span className="stock-text-6">- (0.00%)</span>)
                        }
                      </div>
                    </div>
                  </div>
                </Dialog.Title>
                <div className="flex flex-col mt-2">
                  <div className='text-center mt-4'>
                    <input
                      type="text"
                      pattern="\d*"
                      value={amount}
                      placeholder={`Amount (${data.symbol})`}
                      className='text-center rounded-lg border placeholder-gray-700 bg-gray-300 border-gray-400 focus:border-gray-500 focus:outline-none py-1 w-full'
                      onChange={handleChange}
                    />
                  </div>
                  <div className='text-center text-gray-400 my-5'>Total: <span className="font-bold">{Util.numberWithCommas(amount * data.rate)} coin</span></div>

                  <AlertNotification
                    type={notification.type}
                    info={notification.info}
                  />

                  <div className="flex flex-row mt-4 mb-3 space-x-4">
                    <button
                      type="button"
                      className="flex-1 px-4 py-1 text-base font-medium text-white bg-green-700 border border-transparent rounded-xl hover:bg-green-800 "
                      onClick={buy}
                    >
                      BUY
                    </button>
                    <button
                      type="button"
                      className="flex-1 px-4 py-1 text-base font-medium text-white bg-red-700 border border-transparent rounded-xl hover:bg-red-800 "
                      onClick={sell}
                    >
                      SELL
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </>
        ) : (
          <div className="text-gray-500">
            MARKET CLOSE
          </div>
        )}
      </div>
    </div>
  )
}