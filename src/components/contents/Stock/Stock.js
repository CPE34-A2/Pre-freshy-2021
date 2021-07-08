import Dashboard from '@/components/common/Dashboard'
import StockList from './StockList'
import moment from 'moment'

import { useEffect, useState } from 'react'
import fetchAPI from '@/utils/fetch'

const fetchStocks = async (setState) => {
  fetchAPI('GET', '/api/stock')
    .then(async (response) => setState((await response.json()).data || null))
}

export default function Stock({ user, clan }) {
  const [time, setTime] = useState('')
  const [stocks, setStocks] = useState(null)

  useEffect(() => {
    fetchStocks(setStocks)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(moment().format('MMMM D YYYY, h:mm:ss a'))
    }, 1000)

    return () => clearInterval(timer)
  }, [time])

  return (
    <Dashboard current="stock" user={user} clan={clan}>
      <div className="w-full h-screen flex flex-col items-center justify-center">

        {stocks ?
          (
            <div className='flex h-screen w-full items-center justify-center'>
              <div className='flex flex-col w-full lg:w-auto rounded-2xl p-2  '>
                <StockList
                  clan={clan}
                  stocks={stocks}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-white uppercase">Market Closed</div>
              <div className="text-4xl font-bold text-gray-400 uppercase">Market Closed</div>
              <div className="text-4xl font-bold text-white uppercase">Market Closed</div>
              <div className="text-4xl font-bold text-gray-400 uppercase">Market Closed</div>
              <div className="text-2xl font-bold tracking-widest text-white mt-4 uppercase">{time}</div>
            </div>
          )
        }

      </div>
    </Dashboard>
  )
}