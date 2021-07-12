import { useEffect, useState } from 'react'
import useSocket from '@/hooks/useSocket'
import fetchAPI from '@/utils/fetch'
import BattleItem from './BattleItem'
import Spinner from '@/components/common/Spinner'

const fetchBattles = (clanId, setState) => {
  fetchAPI('GET', `/api/clans/${clanId}/battle?firstIndex=0&lastIndex=6&status=pending`)
    .then(async response => setState((await response.json()).data) || null)
}

export default function BattleList({ user, clan }) {
  const [battles, setBattles] = useState(null)

  // Fetch after render finised
  useEffect(() => {
    fetchBattles(clan._id, setBattles)
  }, [clan.id])

  // WebSocket event listeners for real-time updating 
  useSocket('set.battle', async (target, data) => {
    if (target.includes(clan._id)) {
      const newBattles = battles.filter(battle => battle._id != data._id)
      data.status != 'REJECT' && newBattles.push(data)
      setBattles(newBattles)
    }
  })

  return (
    <div className="flex flex-col w-full h-full bg-gray-300 bg-opacity-40 filter backdrop-blur-3xl p-5 rounded-2xl shadow-lg">
      <div className="text-2xl font-bold tracking-wider text-white mb-4">BATTLE</div>

      {battles && battles.length != 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-y-auto gap-5 h-96 2xl:h-full">
          {battles.map(battle => (
            <BattleItem
              key={battle._id}
              data={battle}
              user={user}
              clan={clan}
            />
          ))}
        </div>
      )}

      {battles && battles.length == 0 && (
        <div className="font-semibold text-lg text-gray-600 w-full h-full flex items-center justify-center mb-6">NO BATTLE PENDING</div>
      )}

      {!battles && (
        <div className="font-semibold text-lg text-gray-600 w-full h-full flex items-center justify-center mb-6">
          <div className="mr-4"><Spinner style="w-8 h-8" /></div>
          <span>LOADING BATTLE DATA</span>
        </div>
      )}

    </div>
  )
}