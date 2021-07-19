import RankingItem from '@/components/contents/Leaderboard/RankingItem'
import { Switch } from '@headlessui/react'
import { useState, useEffect } from 'react'
import * as Util from '@/utils/common'



export default function RankingList({ leaderboard: data }) {
  const [isSortedByPlanets, setSortedByPlanets] = useState(false)

  useEffect(() => {
    if (!data) return
    if (isSortedByPlanets) {
      data.sort((a, b) => (a.owned_planet_ids.length > b.owned_planet_ids.length) ? -1 : 1)
    } else {
      data.sort((a, b) => (a.totalPoint > b.totalPoint) ? -1 : 1)
    }
  }, [isSortedByPlanets])

  return (
    <div className="flex flex-col bg-gray-900 p-5 rounded-xl w-full scale-90 md:scale-100 max-w-sm md:max-w-md lg:max-w-lg">
      <div className="flex flex-col">
        <div className="text-4xl font-extrabold text-transparent text-center mt-4 mb-6 bg-clip-text bg-gradient-to-br from-pink-400 to-red-600">Leaderboard</div>

        <div className="flex flex-row justify-between mb-4">
          <div className="flex items-center">
            <span className="mr-2 text-base font-medium text-pink-400">จำนวนดาว</span>
            <Switch
              checked={isSortedByPlanets}
              onChange={setSortedByPlanets}
              className="inline-flex items-center h-5 rounded-full w-11 focus:outline-none transform bg-gray-500"
            >
              <span
                className={`${isSortedByPlanets ? 'translate-x-6' : 'translate-x-1'
                  } pointer-events-none inline-block w-3 h-3 transform bg-white rounded-full transition ease-in-out duration-300`}
              />
            </Switch>
            <span className="ml-2 text-base font-medium text-pink-400">แต้ม</span>
          </div>

          <div className="text-pink-400 font-bold text-lg">
            {isSortedByPlanets ? 'ดาว' : 'แต้ม'}
          </div>
        </div>

        <div className="space-y-2">
          {data && data.map(clan => (
            <RankingItem
              key={clan._id}
              data={clan}
              isSortedByPlanets={isSortedByPlanets}
            />
          ))}
        </div>
      </div>
    </div >
  )
}