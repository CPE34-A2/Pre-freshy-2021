export default function PlanetPopover({ planet, isHover }) {
  return (
    <>
      {isHover &&
        <div className="flex flex-col absolute z-10 bg-white transform -translate-y-16 px-3">
          <div>{planet.name}</div>
          <div>Tier: {planet.tier}</div>
          <div>{planet.owner != 0 ? `Owned by Clan ${planet.owner}` : "Unoccupied"}</div>
        </div>
      }
    </>
  )
}