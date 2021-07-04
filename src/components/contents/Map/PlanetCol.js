import Planet from '@/components/contents/Map/Planet'

export default function PlanetCol({planets, image}) {
  const column = planets.map(planet => {
    return <Planet key={planet._id} planet={planet} image={image} />
  })

  return (
    <div className="flex flex-col justify-evenly" >
      {column}
    </div>
  )
}