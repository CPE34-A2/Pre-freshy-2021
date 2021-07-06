import { useState } from 'react'

import middleware from '@/middlewares/middleware'
import useSocket from '@/hooks/useSocket'

import { getUser } from '@/pages/api/users/[id]/index'
import { getClan } from '@/pages/api/clans/[id]/index'

import Stock from '@/components/contents/Stock/Stock'

export default function StockPage({ user, clan: rawClan }) {
  const [clan, setClan] = useState(rawClan)

  useSocket('set.clan.stock', (clanId, stocks) => {
    (clanId == user.clan_id) && setClan({ ...clan, properties: { ...clan.properties, stocks } })
  })

  return (
    <Stock
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
