import { useState } from 'react'

import middleware from '@/middlewares/middleware'
import useSocket from '@/hooks/useSocket'

import { getUser } from '@/pages/api/users/[id]/index'
import { getClan } from '@/pages/api/clans/[id]/index'
import { getPlanets } from '@/pages/api/planets/index'

import Map from '@/components/contents/Map/Map'

export default function MapPage({ user: rawUser, planets: rawPlanets, clan: clan }) {
  const [planets, setPlanets] = useState(rawPlanets)

  // WebSocket event listeners for real-time updating 
  useSocket('set.planet', (planetId, planet) => {
    const newPlanets = planets.slice()
    newPlanets[planetId - 1] = planet
    setPlanets(newPlanets)
  })
  

  return (
    <Map 
      user={rawUser}
      clan={clan}
      planets={planets} 
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
    const planets = await getPlanets()

    delete user.__v

    return { props: { user: user, clan: clan, planets: planets } }
  } catch (error) {
    console.log(error.message)
  }
}
