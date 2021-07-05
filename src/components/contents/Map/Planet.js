import Image from "next/image"


export default function Planet({planet, image}) {
  return (
    <div className="flex flex-col justify-between my-4">
      <div className="flex flex-col transform translate-y-1/3">
        <div className="flex justify-center">{planet.name}</div>
        <div className="flex justify-center">Tier: {planet.tier}</div>
      </div>
      <div className="flex justify-center">
        <div className="transform w-3/4 scale-100">
          <Image src={image} alt="" />
        </div>
      </div>
      <div className="flex justify-center">{planet.owner != 0 ? `Owned by Clan ${planet.owner}` : "Unoccupied"}</div>
    </div>
  )
}