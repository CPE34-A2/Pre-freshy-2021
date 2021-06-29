import axios from '@/utils/axios'
import middleware from '@/middlewares/middleware'

// Just a blank page to send logout request without API Requesting tool
export default function LogoutPage() {
  return (
    '¯\\_(ツ)_/¯ Just logout'
  )
}

export async function getServerSideProps({req, res}) {
  try {
    await middleware.run(req, res)
    await axios.delete(`/api/auth`, { headers: { cookie: req.headers.cookie }})

    return { redirect: { destination: '/', permanent: false } }
  } catch (error) {
    console.log(error.message)
  }

  return { props: { } }
}
