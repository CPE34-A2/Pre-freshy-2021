import Dashboard from '@/components/common/Dashboard'
import Todayprice from './TodayPrice'

export default function Stock({ user, clan }) {
  return (
    <Dashboard current="stock" user={user} clan={clan} >
      <Todayprice />
    </Dashboard>
  )
}