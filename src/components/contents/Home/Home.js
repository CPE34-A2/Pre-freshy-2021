import Dashboard from '@/components/common/Dashboard'
import AssetsList from './AssetsList/AssetsList'
import TaskList from './TaskList/TaskList'
import NewsList from './NewsList/NewsList'
import TransactionList from './TransactionList/TransactionList'
import BattleList from './BattleList/BattleList'

export default function Home({ user, clan }) {
  return (
    <Dashboard current="home" user={user} clan={clan}>
      <div className="items-stretch 2xl:h-full flex flex-col 2xl:flex-row p-8 xl:p-12 space-y-8 2xl:space-y-0 2xl:space-x-8">

        <div className="flex flex-col flex-grow space-y-8">
          <div className="w-full flex-shrink md:flex md:flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
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

          <div className="w-full flex-shrink lg:flex lg:flex-col xl:flex-row h-full overflow-y-auto 2xl:space-x-8">
            {/* Show on large screen only (reason of ordering, move below news card) */}
            <div className="hidden 2xl:flex flex-grow h-full w-full xl:max-w-xl">
              <TransactionList
                user={user}
                clan={clan}
              />
            </div>

            <div className="flex flex-col-reverse lg:flex-row flex-grow w-full h-full lg:space-x-8 2xl:space-x-0">
              <div className="flex 2xl:hidden flex-shrink w-full 2xl:h-full mt-8 lg:mt-0">
                <NewsList
                  user={user}
                  clan={clan}
                />
              </div>
              <div className="flex flex-grow w-full h-full">
                <BattleList
                  user={user}
                  clan={clan}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full flex-grow 2xl:max-w-3xl">
          <div className="hidden 2xl:flex flex-shrink w-full 2xl:h-full">
            <NewsList
              user={user}
              clan={clan}
            />
          </div>

          {/* For mobile */}
          <div className="2xl:hidden overflow-y-auto 2xl:h-full">
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