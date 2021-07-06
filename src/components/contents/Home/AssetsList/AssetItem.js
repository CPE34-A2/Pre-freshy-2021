import Image from 'next/image'

export default function AssetItem({ image, value, unit, sideButton }) {
  return (
    <div className="flex flex-row items-center justify-between p-3 bg-white bg-opacity-40 filter backdrop-blur-3xl rounded-xl">
      <div className="flex items-center justify-center">
        <div className="flex drop-shadow-sm">
          <div className="w-10 h-10 md:w-14 md:h-14">
            <Image src={image} alt="" />
          </div>
        </div>
        <div className="flex flex-row ml-4 items-end">
          <div className="font-extrabold text-xl md:text-2xl text-indigo-900">{value}</div>
          <div className="font-medium text-lg text-gray-800 ml-2">{unit}</div>
        </div>
      </div>

      <div className="flex">
        {sideButton}
      </div>
    </div>
  )
}