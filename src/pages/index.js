import middleware from '@/middlewares/middleware'

import { getUser } from '@/pages/api/users/[id]/index'
import { getClanProperties } from '@/pages/api/clans/[id]/properties'

import Head from '@/components/common/Head'
import Navbar from '@/components/navbar/Navbar'
import DashboardContainer from '@/components/contents/dashboard/DashboardCotainer'
import Dashboard from '@/components/contents/dashboard/Dashboard'
import Footer from '@/components/footer/Footer'

export default function IndexPage({ user, clan }) {
  return (
    <DashboardContainer>
      <Head />

      <Navbar
        user={user}
      />

      <Dashboard
        user={user}
        clan={clan}
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

    const user = await getUser(req.user.id)
    const clan = await getClanProperties(req.user.clan_id)

    return { props: { user: user, clan: clan } }
  } catch (error) {
    console.log(error.message)
  }
}
