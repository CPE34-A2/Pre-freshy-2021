import Head from './Head'
import Navbar from './Navbar/Navbar'

export default function Dashboard({ children, current, user, clan }) {
  return (
    <div className="flex-col w-full md:flex md:flex-row md:min-h-screen">
      <Head />

      <Navbar current={current} user={user} clan={clan} />

      <div className="flex flex-col w-full dashboard-background h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  )
}