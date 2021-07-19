import Dashboard from '@/components/common/Dashboard'
import RankingList from './RankingList'

export default function Leaderboard({ user, clan }) {
  return (
    <Dashboard current="leaderboard" user={user} clan={clan}>
      <div className="w-full h-full flex flex-col items-center justify-center scale-95 md:scale-75 lg:scale-90 2xl:scale-100">
        <RankingList/>
      </div>
    </Dashboard>
  )
}