import fetchAPI from '@/utils/fetch'
import { useState, useEffect } from 'react'
import TransactionItem from './TransactionItem'

export default function TransactionList({ clan }) {
  const [transactions, setTransactions] = useState('')

  useEffect(() => {
    fetchAPI('GET', `/api/clans/${clan._id}/transactions?firstIndex=0&lastIndex=9`)
      .then(res => res.json())
      .then(data => { 
        data = data.data.filter(Boolean)
        setTransactions(data)
    })
  }, [])

  return (
    <div className="flex flex-col h-full bg-gray-300 bg-opacity-40 filter backdrop-blur-3xl p-5 rounded-2xl shadow-lg overflow-y-auto">
      <div className="text-2xl font-bold tracking-wider text-white mb-4">TRANSACTIONS LOG</div>

      <div className="overflow-y-auto space-y-4">
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