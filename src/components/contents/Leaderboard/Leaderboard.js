import { useState, useEffect } from 'react'

import Dashboard from '@/components/common/Dashboard'
import RankingList from './RankingList'

import fetchAPI from '@/utils/fetch'

export default function Leaderboard({ user, clan }) {
  const [leaderboard, setLeaderboard] = useState(null)
  
  useEffect(() => {
    fetchAPI('GET', '/api/leaderboard?sort=point')
      .then(response => response.json())
      .then(data => setLeaderboard(data.data))
  }, [])

  return (
    <Dashboard current="leaderboard" user={user} clan={clan}>
      <div className="w-full h-full flex flex-col items-center justify-center scale-95 md:scale-75 lg:scale-90 2xl:scale-100">
        <RankingList
          leaderboard={leaderboard}
        />
      </div>
    </Dashboard>
  )
}