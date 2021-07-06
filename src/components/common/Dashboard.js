import Head from './Head'
import Navbar from './Navbar/Navbar'
import * as Util from '@/utils/common'

export default function Dashboard({ children, current, user, clan }) {
  return (
    <div className="flex-col w-full md:flex md:flex-row md:min-h-screen">
      <Head />

      <Navbar current={current} user={user} clan={clan} />

      <div 
        className={Util.concatClasses(
          "flex flex-col w-full h-screen overflow-y-auto",
          current == 'map' ? 'dashboard-background-dark' : 'dashboard-background'
        )}
      >
        {children}
      </div>
    </div>
  )
}