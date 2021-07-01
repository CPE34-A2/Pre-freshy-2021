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

    req.logout()

    return { redirect: { destination: '/login', permanent: false } }
  } catch (error) {
    console.log(error.message)
  }

  return { props: { } }
}
