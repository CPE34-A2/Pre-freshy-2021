export default function PlanetListItem({ planet, index, handlePlanetChange }) {
  return (
    <div className="flex flex-row">
      <div className="mr-2">
        <input
          name={index}
          type="checkbox"
          onChange={handlePlanetChange}
        />
      </div>
      <div className="font-semibold">
        {planet}
      </div>
    </div>
  )
}