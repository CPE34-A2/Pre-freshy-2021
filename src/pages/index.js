import middleware from '@/middlewares/middleware'
import axios from '@/utils/axios'

import Head from '@/components/common/Head'
import Navbar from '@/components/navbar/Navbar'
import DashboardContainer from '@/components/contents/dashboard/DashboardCotainer'
import Dashboard from '@/components/contents/dashboard/Dashboard'
import Footer from '@/components/footer/Footer'

export default function IndexPage({ user }) {
  return (
    <DashboardContainer>
      <Head />

      <Navbar
        user={user}
      />

      <Dashboard
        user={user}
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
    
    const result = await axios.get(`/api/users/${req.user.id}`, { headers: { cookie: req.headers.cookie }})
    return { props: { user: result.data.data } }
  } catch (error) {
    console.log(error.message)
  }
}
