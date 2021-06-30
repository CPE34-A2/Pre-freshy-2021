import middleware from '@/middlewares/middleware'
import axios from '@/utils/axios'

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

    const opts = { headers: { cookie: req.headers.cookie } }
    const user = await axios.get(`/api/users/${req.user.id}`, opts)
    const clan = await axios.get(`/api/clans/${req.user.clan_id}/properties`, opts)

    return { props: { user: user.data.data, clan: clan.data.data } }
  } catch (error) {
    console.log(error.message)
  }
}
