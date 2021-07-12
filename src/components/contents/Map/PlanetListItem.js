import * as Util from '@/utils/common'

export default function PlanetListItem({ planet, index, handlePlanetChange }) {
  return (
    <div className="flex flex-row">
      {planet > 7 &&
        <>
          <div className="mr-2">
            <input
              name={index}
              type="checkbox"
              onChange={handlePlanetChange}
            />
          </div>
          <div className="font-semibold">
            {planet} <span className="text-gray-400 font-light">({Util.getPlanetTier(planet)})</span>
          </div>
        </>
      }
    </div>
  )
}