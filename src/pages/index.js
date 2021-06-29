import middleware from '@/middlewares/middleware'
import { getUserData } from '../services/user'

import Head from '@/components/common/Head'
import Navbar from '@/components/navbar/Navbar'
import DashboardContainer from '@/components/contents/dashboard/DashboardCotainer'
import Dashboard from '@/components/contents/dashboard/Dashboard'
import Footer from '@/components/footer/Footer'

export default function IndexPage({ user }) {
  return (
    <DashboardContainer>
      <Head />

      <Navbar />

      <Dashboard
        displayName={user.display_name}
        money={user.properties.money}
      />

      <Footer />
    </DashboardContainer>
  )
}

export async function getServerSideProps({ req, res }) {
  try {
    await middleware.run(req, res)

    if (!req.isAuthenticated()) {
      return { redirect: { destination: '/login', permanent: false } }
    }
    
    const userData = JSON.parse(JSON.stringify(await getUserData(req.user.id)))

    return { props: { user: userData } }
  } catch (error) {
    console.log(error.message)
  }
}
