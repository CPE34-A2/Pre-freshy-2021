import Dashboard from '@/components/common/Dashboard'
import AssetsList from './AssetsList/AssetsList'
import TaskList from './TaskList/TaskList'
import NewsList from './NewsList/NewsList'
import TransactionList from './TransactionList/TransactionList'

export default function Home({ user, clan }) {
  return (
    <Dashboard current="home" user={user} clan={clan}>
      <div className="items-stretch xl:h-full flex flex-col xl:flex-row p-8 lg:p-12 space-y-8 lg:space-y-12 xl:space-y-0 xl:space-x-12">

        <div className="flex flex-col space-y-8 lg:space-y-12 flex-shrink-0 flex-grow">
          <div className="flex-shrink-0 lg:flex lg:flex-col xl:flex-row space-y-8 lg:space-y-12 xl:space-y-0 xl:space-x-12">
            <div className="flex-shrink">
              <AssetsList
                user={user}
                clan={clan}
              />
            </div>

            <div className="flex-shrink w-full xl:max-w-2xl">
              <TaskList
                user={user}
                clan={clan}
              />
            </div>
          </div>

          <div className="h-full overflow-y-auto">
            <TransactionList
              user={user}
              clan={clan}
            />
          </div>
        </div>

        <div className="flex flex-col flex-grow-0 flex-shrink">
          <NewsList
            user={user}
            clan={clan}
          />
        </div>

      </div>
    </Dashboard>
  )
}