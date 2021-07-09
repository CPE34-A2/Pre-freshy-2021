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
      <div className="flex flex-col-reverse xl:flex-row w-full h-full justify-between px-12 md:p-24 scale-75 md:scale-100">
        {(true) ? (
          <>
            <div className="flex flex-col items-center w-full h-full justify-center">
              <h1 className="text-white text-3xl font-bold">COMMING SOON</h1>
              <h1 className="text-gray-500 text-3xl font-bold">COMMING SOON</h1>
              <h1 className="text-white text-3xl font-bold">COMMING SOON</h1>
            </div>
          </>
        ) : (
          <>
            <PlanetCol clan={clan} planets={theOne} image={TheOne} className="w-40 h-40" />
            <PlanetCol clan={clan} planets={planetB} image={B} className="w-28 h-28" />
            <PlanetCol clan={clan} planets={planetX1} image={X} className="w-24 h-24" />
            <PlanetCol clan={clan} planets={planetX2} image={X} className="w-24 h-24" />
            <PlanetCol clan={clan} planets={planetC} image={C} className="w-16 h-16" />
            <PlanetCol clan={clan} planets={planetD1} image={D} className="w-12 h-12" />
            <PlanetCol clan={clan} planets={planetD2} image={D} className="w-12 h-12" />
            <PlanetCol clan={clan} planets={planetHome} image={Home} className="w-14 h-14" />
          </>
        )}
      </div>
    </Dashboard>

  )
}