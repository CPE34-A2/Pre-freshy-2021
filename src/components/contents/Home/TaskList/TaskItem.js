import Image from 'next/image'

export default function TaskItem({ image, amount, unit, coin, accept, reject }) {
  return (
    <div className="flex flex-col w-52 h-52 px-4 justify-between">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center drop-shadow-sm">
            <div className="w-14 h-14">
              <Image 
                src={image}
                alt=""
              />
            </div>
          </div>
          <div className="flex flex-col text-3xl ml-3 leading-none">
            <div className="font-bold text-indigo-900">{amount}</div>
            <div className="font-medium text-sm text-indigo-900">{unit}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <span className="text-lg text-gray-500 mr-2">for</span>
        <span className="font-bold text-4xl text-indigo-900 items-center">{coin}</span>
        <span className="text-xl font-bold text-indigo-900 mt-auto ml-1">coin</span>
      </div>

      <div className="flex flex-row gap-x-2 mx-2">
        <div className="flex flex-col flex-grow">
          <p className="flex justify-center items-center text-lg font-semibold text-gray-500 mb-1">{accept.current} / {accept.require}</p>
          <button className="flex justify-center items-center bg-purple-300 hover:bg-purple-400 text-purple-600 hover:text-purple-800 font-bold text-sm py-1 rounded-xl shadow-sm uppercase">
            Accept
          </button>
        </div>

        <div className="flex flex-col flex-grow">
          <p className="flex justify-center items-center text-lg font-semibold text-gray-500 mb-1">{reject.current} / {reject.require}</p>
          <button className="flex justify-center items-center bg-red-300 hover:bg-red-400 text-red-600 hover:text-red-800 font-bold text-sm py-1 rounded-xl shadow-sm uppercase">
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}