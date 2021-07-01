import Image from 'next/image'

export default function AssetItem({ image, value, unit }) {
  return (
    <div className="flex flex-row items-center">
      <div className="flex items-center justify-center drop-shadow-sm">
        <div className="w-10 h-10">
          <Image src={image} />
        </div>
      </div>
      <div className="flex flex-col ml-3 leading-none">
        <div className="font-extrabold text-indigo-900">{value}</div>
        <div className="font-light text-sm text-indigo-900">{unit}</div>
      </div>
    </div>
  )
}