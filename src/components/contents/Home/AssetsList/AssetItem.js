import Image from 'next/image'

export default function AssetItem({ image, value, unit, sideButton }) {
  return (
    <div className="flex flex-row items-center justify-between p-2 bg-white bg-opacity-80 space-x-4 rounded-xl">
      <div className="flex items-center justify-center">
        <div className="flex drop-shadow-sm">
          <div className="w-10 h-10 md:w-12 md:h-12">
            <Image src={image} alt="" />
          </div>
        </div>
        <div className="flex flex-row ml-4 items-end">
          <div className="font-extrabold text-lg text-indigo-900">{value}</div>
          <div className="font-medium text-base text-gray-800 ml-2">{unit}</div>
        </div>
      </div>

      <div className="flex">
        {sideButton}
      </div>
    </div>
  )
}