import { useState } from 'react'

import middleware from '@/middlewares/middleware'
import useSocket from '@/hooks/useSocket'

import { getPlanets } from '@/pages/api/planets/index'

import Map from '@/components/contents/Map/Map'

export default function MapPage({ planets: rawPlanets}) {
  const [planets, setPlanets] = useState(rawPlanets)

  // WebSocket event listeners for real-time updating 
  useSocket('set.planet', (planetId, planet) => {
    planets[planetId - 1] = planet
    console.log(planets)
    setPlanets(planets)
  })

  return (
    <Map 
      planets = {planets}
    />
  )
}

export async function getServerSideProps({ req, res }) {
  try {
    await middleware.run(req, res)

    if (!req.isAuthenticated()) {
      return { redirect: { destination: '/login', permanent: false } }
    }

    const planets = await getPlanets()
    
    planets.forEach(planet => {
      delete planet.__v
      delete planet.redeem
      delete planet.quest
    })

    return { props: { planets: planets} }
  } catch (error) {
    console.log(error.message)
  }
}
