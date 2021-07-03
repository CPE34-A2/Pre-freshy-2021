import AssetsList from './AssetsList/AssetsList'

export default function Dashboard({ user, clan }) {
  return (
    <div className="flex flex-col w-full p-12 dashboard-background">
      <AssetsList user={user} clan={clan} />
    </div>
  )
}