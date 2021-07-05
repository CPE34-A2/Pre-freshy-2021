import Head from './Head'
import Navbar from './Navbar/Navbar'

export default function Dashboard({ children, current, user }) {
  return (
    <div className="flex-col w-full md:flex md:flex-row md:min-h-screen">
      <Head />

      <Navbar current={current} user={user} />

      <div className="flex flex-col w-full dashboard-background">
        <div className="flex flex-row flex-wrap space-y-8 lg:space-y-12 xl:space-y-0 xl:space-x-12 p-8 lg:p-12">
          {children}
        </div>
      </div>
    </div>
  )
}