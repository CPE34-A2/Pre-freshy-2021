export default function TransactionItem() {
  return (
    <div className="flex flex-col items-center justify-between p-3 bg-white bg-opacity-5 space-x-4 filter backdrop-blur-3xl rounded-xl">
      <div className="flex items-center justify-center">
        <div className="flex drop-shadow-sm">
          <div className="w-10 h-10 md:w-14 md:h-14">
            {/* <Image src={} alt="" /> */}
          </div>
        </div>
        <div className="flex flex-row ml-4 items-end">
          <div className="font-extrabold text-xl text-indigo-900"></div>
          <div className="font-medium text-lg text-gray-800 ml-2"></div>
        </div>
      </div>

      <div className="flex">
      </div>
    </div>
  )
}