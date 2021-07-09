import Dashboard from '@/components/common/Dashboard'
import StockList from './StockList'

import { useEffect, useState } from 'react'
import fetchAPI from '@/utils/fetch'

const fetchStocks = async (setState) => {
  fetchAPI('GET', '/api/stock')
    .then(async (response) => setState((await response.json()).data || null))
}

export default function Stock({ user, clan }) {
  const [stocks, setStocks] = useState(null)

  useEffect(() => {
    fetchStocks(setStocks)
  }, [])

  return (
    <Dashboard current="stock" user={user} clan={clan}>
      <div className="w-full h-full flex flex-col items-center justify-center">
        {stocks && (
          <StockList
            clan={clan}
            stocks={stocks}
          />
        )}
      </div>
    </Dashboard>
  )
}