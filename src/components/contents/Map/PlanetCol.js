import Planet from '@/components/contents/Map/Planet'

export default function PlanetCol({ clan, planets, image, className}) {
  const column = planets.map(planet => {
    return <Planet clan={clan} key={planet._id} planet={planet} image={image} className={className} />
  })

  return (
    <div className="flex flex-row xl:flex-col justify-around">
      {column}
    </div>
  )
}