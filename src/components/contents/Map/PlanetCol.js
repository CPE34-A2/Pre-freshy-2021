import Planet from '@/components/contents/Map/Planet'

export default function PlanetCol({ user, clan, planets, image, className}) {
  const column = planets.map(planet => {
    return <Planet user={user} clan={clan} key={planet._id} planet={planet} image={image} className={className} />
  })

  return (
    <div className="flex flex-row xl:flex-col justify-around">
      {column}
    </div>
  )
}