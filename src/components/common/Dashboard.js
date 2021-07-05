import Head from './Head'
import Navbar from './Navbar/Navbar'

export default function Dashboard({ children, current, user }) {
  return (
    <div className="flex-col w-full md:flex md:flex-row md:min-h-screen">
      <Head />

      <Navbar current={current} user={user} />

      <div className="flex flex-col w-full dashboard-background">
        <div className="flex flex-row flex-wrap space-y-12 lg:space-y-0 lg:space-x-12 p-12">
          {children}
        </div>
      </div>
    </div>
  )
}