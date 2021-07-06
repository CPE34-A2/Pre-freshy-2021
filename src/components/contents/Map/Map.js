import PlanetCol from '@/components/contents/Map/PlanetCol'
import Home from '@/publics/planets/Home.png'
import D from '@/publics/planets/D.png'
import C from '@/publics/planets/C.png'
import B from '@/publics/planets/B.png'
import X from '@/publics/planets/X.png'
import TheOne from '@/publics/planets/The_one.png'
import Dashboard from '@/components/common/Dashboard'

export default function Map({ user, clan, planets }) {
  function filterTier(planet, tier) {
    return planet.tier == tier ? true : false
  }

  const planetHome = planets.filter(planet => filterTier(planet, 'HOME'))
  const planetD = planets.filter(planet => filterTier(planet, 'D'))
  const planetC = planets.filter(planet => filterTier(planet, 'C'))
  const planetB = planets.filter(planet => filterTier(planet, 'B'))
  const planetX = planets.filter(planet => filterTier(planet, 'X'))
  const theOne = planets.filter(planet => filterTier(planet, 'S'))

  const planetX1 = planetX.slice(0, Math.ceil((planetX.length) / 2))
  const planetX2 = planetX.slice(Math.ceil((planetX.length) / 2))

  const planetD1 = planetD.slice(0, (planetD.length) / 2)
  const planetD2 = planetD.slice((planetD.length) / 2)

  return (
    <Dashboard current="map" user={user} clan={clan} >
      <div className="flex flex-col-reverse md:flex-row justify-evenly w-full h-screen">
        <PlanetCol planets={theOne} image={TheOne} className="w-40 h-40" />
        <PlanetCol planets={planetB} image={B} className="w-28 h-28" />
        <PlanetCol planets={planetX1} image={X} className="w-24 h-24" />
        <PlanetCol planets={planetX2} image={X} className="w-24 h-24" />
        <PlanetCol planets={planetC} image={C} className="w-16 h-16" />
        <PlanetCol planets={planetD1} image={D} className="w-12 h-12" />
        <PlanetCol planets={planetD2} image={D} className="w-12 h-12" />
        <PlanetCol planets={planetHome} image={Home} className="w-14 h-14" />
      </div>
    </Dashboard>
    
  )
}