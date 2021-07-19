import middleware from '@/middlewares/middleware'

import { getUser } from '@/pages/api/users/[id]/index'
import { getClan } from '@/pages/api/clans/[id]/index'

import Leaderboard from '@/components/contents/Leaderboard/Leaderboard'

export default function LeaderboardPage({ user, clan }) {
  return (
    <Leaderboard
      user={user}
      clan={clan}
    />
  )
}

export async function getServerSideProps({ req, res }) {
  try {
    await middleware.run(req, res)

    if (!req.isAuthenticated()) {
      return { redirect: { destination: '/login', permanent: false } }
    }

    const user = await getUser(req.user.id)
    const clan = await getClan(req.user.clan_id)

    delete user.__v
    
    return { props: { user: user, clan: clan } }
  } catch (error) {
    console.log(error.message)
  }
}
