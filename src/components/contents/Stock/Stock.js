import Dashboard from '@/components/common/Dashboard'
import Todayprice from './todayprice'
export default function Stock({ user }) {
  return (
    <Dashboard current="stock" user={user} >
      <Todayprice />
    </Dashboard>
  )
}