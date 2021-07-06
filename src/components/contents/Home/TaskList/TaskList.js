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
    not_found: 'No fuel transaction at this moment'
  },
  stock: {
    info: 'Leader need to invest in stock',
    received_title: 'Stock',
    received_unit: '',
    cost_title: 'Cost',
    cost_unit: 'coin',
    not_found: 'No stock investment at this moment'
  },
  planet: {
    info: 'Captain need to land on planet',
    received_title: 'Planet',
    received_unit: '',
    cost_title: 'Cost',
    cost_unit: 'gallon',
    not_found: 'No planet conquered at this moment'
  }
}

const fetchTransaction = (clanId, type, setState) => {
  fetchAPI('GET', `/api/clans/${clanId}/transfer/${type}`)
    .then(async response => setState(await response.json()))
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
    <div className="flex flex-col w-full xl:w-auto">
      <div className="flex flex-col bg-purple-50 p-5 rounded-2xl shadow-lg">
        <div className="text-xl font-extrabold tracking-wider text-indigo-800 mb-4">TASKS</div>

        <div className="flex flex-col space-y-4">
          <TaskItem
            clan={clan}
            image={GallonImage}
            data={fuel}
            locale={transactionLocales.fuel}
          />

          <TaskItem
            clan={clan}
            image={StarImage}
            data={planet}
            locale={transactionLocales.planet}
          />

          <TaskItem
            clan={clan}
            image={StockImage}
            data={stock}
            locale={transactionLocales.stock}
          />
        </div>
      </div>
    </div>
  )
}