import Dashboard from '@/components/common/Dashboard'
import AssetsList from './AssetsList/AssetsList'
import TaskList from './TaskList/TaskList'
import NewsList from './NewsList/NewsList'
import TransactionList from './TransactionList/TransactionList'

export default function Home({ user, clan }) {
  return (
    <Dashboard current="home" user={user} clan={clan}>
      <div className="items-stretch xl:h-full flex flex-col xl:flex-row p-8 xl:p-12 space-y-8 lg:space-y-12 xl:space-y-0 xl:space-x-8">

        <div className="flex flex-col flex-grow space-y-8">
          <div className="w-full flex-shrink lg:flex lg:flex-col xl:flex-row space-y-8 xl:space-y-0 xl:space-x-8">
            <div className="flex-grow xl:max-w-lg">
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

          <div className="hidden xl:flex w-full flex-grow overflow-y-auto">
            <TransactionList
              user={user}
              clan={clan}
            />
          </div>
        </div>

        <div className="flex flex-col h-full flex-grow xl:max-w-3xl">
          <div className="flex flex-shrink h-full w-full">
            <NewsList
              user={user}
              clan={clan}
            />
          </div>

          {/* For mobile */}
          <div className="flex 2xl:hidden h-full overflow-y-auto mt-8">
            <TransactionList
              user={user}
              clan={clan}
            />
          </div>
        </div>

      </div>
    </Dashboard>
  )
}