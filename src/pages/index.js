import { useState } from 'react'

import middleware from '@/middlewares/middleware'
import useSocket from '@/hooks/useSocket'

import { getUser } from '@/pages/api/users/[id]/index'
import { getClan } from '@/pages/api/clans/[id]/index'

import Home from '@/components/contents/Home/Home'

export default function IndexPage({ user: rawUser, clan: rawClan }) {
  const [user, setUser] = useState(rawUser)
  const [clan, setClan] = useState(rawClan)

  // WebSocket event listeners for real-time updating 
  useSocket('set.user.money', (userId, money) => {
    (userId == user._id) && setUser({ ...user, money: money })
  })

  useSocket('set.clan.money', (clanId, money) => {
    (clanId == user.clan_id) && setClan({ ...clan, properties: { ...clan.properties, money } })
  })

  useSocket('set.clan.fuel', (clanId, fuel) => {
    (clanId == user.clan_id) && setClan({ ...clan, properties: { ...clan.properties, fuel } })
  })

  useSocket('set.clan.planets', (clanId, owned_planet_ids) => {
    (clanId == user.clan_id) && setClan({ ...clan, owned_planet_ids })
  })

  return (
    <Home 
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
    delete clan.__v
    delete clan.properties.stocks
    delete clan.members
    delete clan.position
    
    return { props: { user: user, clan: clan } }
  } catch (error) {
    console.log(error.message)
  }
}
