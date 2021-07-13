import fetchAPI from '@/utils/fetch'
import { useState, useEffect } from 'react'
import TransactionItem from './TransactionItem'
import useSocket from '@/hooks/useSocket'

export default function TransactionList({ clan }) {
  const [transactions, setTransactions] = useState('')

  useEffect(() => {
    fetchAPI('GET', `/api/clans/${clan._id}/transactions?firstIndex=0&lastIndex=9`)
      .then(res => res.json())
      .then(data => { 
        data = data.data.filter(Boolean)
        setTransactions(data)
    })
  }, [clan._id])

  // WebSocket event listeners for real-time updating 
  useSocket('set.transaction', async (target, data) => {
    if (target == clan._id) {
      const newTransactions = transactions.filter(transaction => transaction._id != data._id)
      newTransactions.unshift(data)
      setTransactions(newTransactions)
    }
  })

  return (
    <div className="flex flex-col h-full w-full bg-gray-300 bg-opacity-40 filter backdrop-blur-3xl p-5 rounded-2xl shadow-lg">
      <div className="text-2xl font-bold tracking-wider text-white mb-4">TRANSACTIONS LOG</div>

      <div className="overflow-y-auto space-y-4 h-64 2xl:h-full">
        {transactions && transactions.map(item => (
          <TransactionItem 
            key={item._id}
            transaction={item}          
          />
        ))}
      </div>
    </div>
  )
}