export default function DashboardContainer(props) {
  return (
    <div className="flex-col w-full md:flex md:flex-row md:min-h-screen">
      {props.children}
    </div>
  )
}