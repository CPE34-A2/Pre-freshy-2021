export default function StockItem({ data, isSortedByPlanets }) {

  return (
    <div className="flex flex-row justify-between items-center border-b pt-4 pb-6 border-gray-700">

      <div className="flex flex-row h-full items-stretch">
        <div className="flex flex-col justify-center">
          <div className="font-bold text-lg text-gray-300">
            <span className="text-gray-500">0{data._id} </span>
            <span>{data.name}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="font-semibold text-lg text-white">
          {isSortedByPlanets ?
            <span>{data.owned_planet_ids.length}</span> :
            <span>{data.totalPoint}</span>
          }
        </div>
      </div>
      
    </div>
  )
}