import GallonImage from '@/publics/gallon.png'
import StarImage from '@/publics/star.png'
import StockImage from '@/publics/stock.png'

import { useEffect, useState } from 'react'
import fetchAPI from '@/utils/fetch'
import useSocket from '@/hooks/useSocket'

import TaskItem from './TaskItem'

const transactionLocales = {
  fuel: {
    info: 'Leader need to buy fuel',
    received_title: 'Amount',
    received_unit: 'gallon',
    cost_title: 'Cost',
    cost_unit: 'coin',
    not_found: 'No fuel request at this moment'
  },
  stock: {
    buy : {
      info: 'Leader need to invest in stock',
      received_title: 'Stock',
      received_unit: '',
      cost_title: 'Cost',
      cost_unit: 'coin',
      not_found: 'No stock request at this moment'
    },
    sell : {
      info: 'Leader need to invest in stock',
      received_title: 'Income',
      received_unit: 'coin',
      cost_title: 'Cost',
      cost_unit: '',
      not_found: 'No stock request at this moment'
    }
  },
  planet: {
    info: 'Captain need to land on planet',
    received_title: 'Planet',
    received_unit: '',
    cost_title: 'Cost',
    cost_unit: 'gallon',
    not_found: 'No planet request at this moment'
  }
}

const fetchTransaction = (clanId, type, setState) => {
  fetchAPI('GET', `/api/clans/${clanId}/transfer/${type}`)
    .then(async response => setState(await response.json()))
}

const isBuyingStock = (stock) => {
  if (!stock) return 'buy' // Fake data
  if (!stock.data) return 'buy' // Fake data
  return (stock.data.owner == 'market')
}

export default function TaskList({ user, clan }) {
  const [fuel, setFuel] = useState(null)
  const [planet, setPlanet] = useState(null)
  const [stock, setStock] = useState(null)

  // Fetch after render finished
  useEffect(() => {
    fetchTransaction(clan._id, 'fuel', setFuel)
    fetchTransaction(clan._id, 'planet', setPlanet)
    fetchTransaction(clan._id, 'stock', setStock)
  }, [])

  // WebSocket event listeners for real-time updating 
  useSocket('set.task.fuel', async (targetClanId, data) => {
    (targetClanId == clan._id) && setFuel({ data: data })
  })

  useSocket('set.task.travel', (targetClanId, data) => {
    (targetClanId == clan._id) && setPlanet({ data: data })
  })

  useSocket('set.task.stock', (targetClanId, data) => {
    (targetClanId == clan._id) && setStock({ data: data })
  })

  return (
    <div className="flex flex-col bg-gray-300 bg-opacity-40 filter backdrop-blur-3xl p-5 rounded-2xl shadow-lg">
      <div className="text-2xl font-bold tracking-wider text-white mb-4">TASKS</div>

      <div className="flex flex-col space-y-4">
        <TaskItem
          user={user}
          clan={clan}
          image={GallonImage}
          data={fuel}
          locale={transactionLocales.fuel}
        />

        <TaskItem
          user={user}
          clan={clan}
          image={StarImage}
          data={planet}
          locale={transactionLocales.planet}
        />

        <TaskItem
          user={user}
          clan={clan}
          image={StockImage}
          data={stock}
          locale={transactionLocales.stock[isBuyingStock(stock || { data: { owner: {} }}) ? 'buy' : 'sell']}
        />
      </div>
    </div>
  )
}