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

export default function TaskList({ user, clan }) {
  const [fuel, setFuel] = useState(null)
  const [planet, setPlanet] = useState(null)
  const [stock, setStock] = useState(null)

  // Fetch after render finished
  useEffect(() => {
    fetchAPI('GET', `/api/clans/${user.clan_id}/transfer/fuel`)
      .then(async response => setFuel(await response.json()))

    fetchAPI('GET', `/api/clans/${user.clan_id}/transfer/planet`)
      .then(async response => setPlanet((await response.json()) || {}))

    fetchAPI('GET', `/api/clans/${user.clan_id}/transfer/stock`)
      .then(async response => setStock((await response.json()) || {}))
  }, [])

  // WebSocket event listeners for real-time updating 
  useSocket('set.task.fuel', (transactionId, data) => {
    (transactionId == fuel.data._id) &&
      setFuel({ ...fuel, data: { ...fuel.data, confirmer: data.confirmer, rejector: data.rejector } })
  })

  useSocket('set.task.travel', (transactionId, data) => {
    (transactionId == fuel.data._id) &&
      setFuel({ ...planet, data: { ...planet.data, confirmer: data.confirmer, rejector: data.rejector } })
  })

  useSocket('set.task.stock', (transactionId, data) => {
    (transactionId == stock.data._id) &&
      setFuel({ ...stock, data: { ...stock.data, confirmer: data.confirmer, rejector: data.rejector } })
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