import AssetsList from './AssetsList'

export default function Dashboard({ user, clan }) {
  return (
    <div className="flex flex-col w-full p-12">
      <AssetsList user={user} clan={clan} />
    </div>
  )
}