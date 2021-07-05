import GallonImage from '@/publics/gallon.png'
import StarImage from '@/publics/star.png'
import StockImage from '@/publics/stock.png'

import TaskItem from './TaskItem'

import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then(res => res.json())

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
    not_found: 'No planet conquering at this moment'
  }
}

export default function TaskList() {
  const { data: fuel, error: fuelError } = useSWR('/api/clans/6/transfer/fuel', fetcher)
  const { data: stock, error: stockError } = useSWR('/api/clans/6/transfer/stock', fetcher)
  const { data: planet, error: planetError } = useSWR('/api/clans/6/transfer/planet', fetcher)

  return (
    <div className="flex flex-col w-full md:w-auto p-12">
      <div className="flex flex-col mt-4 bg-purple-50 p-5 rounded-2xl shadow-lg">
        <div className="text-xl font-extrabold tracking-wider text-indigo-800 mb-4">TASKS</div>

        <div className="flex flex-col space-y-4">

          <TaskItem
            image={GallonImage}
            data={fuel}
            locale={transactionLocales.fuel}
          />

          <TaskItem
            image={StarImage}
            data={planet}
            locale={transactionLocales.planet}
          />

          <TaskItem
            image={StockImage}
            data={stock}
            locale={transactionLocales.stock}
          />

        </div>
      </div>
    </div>
  )
}