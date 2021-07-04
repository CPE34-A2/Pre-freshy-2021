import PlanetCol from '@/components/contents/Map/PlanetCol'
import Home from '@/publics/planets/Home.png'
import D from '@/publics/planets/D.png'
import C from '@/publics/planets/C.png'
import B from '@/publics/planets/B.png'
import X from '@/publics/planets/X.png'
import TheOne from '@/publics/planets/The_one.png'

export default function Map({ planets }) {
  function filterTier(planet, tier) {
    return planet.tier == tier ? true : false
  }

  const planetHome = planets.filter(planet => filterTier(planet, 'Home'))
  const planetD = planets.filter(planet => filterTier(planet, 'D'))
  const planetC = planets.filter(planet => filterTier(planet, 'C'))
  const planetB = planets.filter(planet => filterTier(planet, 'B'))
  const planetX = planets.filter(planet => filterTier(planet, 'X'))
  const theOne = planets.filter(planet => filterTier(planet, 'The_one'))


  return (
    <div className="flex flex-row justify-evenly">
      <PlanetCol planets={theOne} image={TheOne} />
      <PlanetCol planets={planetX} image={X} />
      <PlanetCol planets={planetB} image={B} />
      <PlanetCol planets={planetC} image={C} />
      <PlanetCol planets={planetD} image={D} />
      <PlanetCol planets={planetHome} image={Home} />
    </div>
  )
}