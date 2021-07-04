import Dashboard from '@/components/common/Dashboard'
import AssetsList from './AssetsList/AssetsList'
import TaskList from './TaskList/TaskList'

export default function Home({ user, clan }) {
  return (
    <Dashboard current="home" user={user} >

      <AssetsList
        user={user}
        clan={clan}
      />

      <TaskList
        user={user}
        clan={clan}
      />

    </Dashboard>
  )
}