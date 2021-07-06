import Dashboard from '@/components/common/Dashboard'
import AssetsList from './AssetsList/AssetsList'
import TaskList from './TaskList/TaskList'

export default function Home({ user, clan }) {
  return (
    <Dashboard current="home" user={user} clan={clan}>
      <div className="flex flex-row w-full flex-wrap space-y-8 lg:space-y-12 xl:space-y-0 2xl:space-x-12 p-8 lg:p-12">
          <div className="flex-grow">
            <AssetsList
              user={user}
              clan={clan}
            />
          </div>

          <div className="flex-grow">
            <TaskList
              user={user}
              clan={clan}
            />
          </div>
      </div>
    </Dashboard>
  )
}