import Planet from '@/components/contents/Map/Planet'

export default function PlanetCol({planets, image, className}) {
  const column = planets.map(planet => {
    return <Planet key={planet._id} planet={planet} image={image} className={className} />
  })

  return (
    <div className="flex flex-row md:flex-col justify-around">
      {column}
    </div>
  )
}