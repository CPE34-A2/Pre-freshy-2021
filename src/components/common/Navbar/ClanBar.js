import * as Util from '@/utils/common'

export default function ClanBar({ clan, mobile }) {
  return (
    <div
      className={Util.concatClasses(
        "flex flex-row mb-4 p-2 bg-indigo-800 rounded-lg",
        mobile ? "my-4" : "hidden md:flex mx-4"
      )}
    >
      <div className="flex flex-shrink-0 flex-grow-0 w-12 h-12 bg-indigo-700 rounded-lg">
        <span className="flex items-center justify-center h-full w-full font-bold text-3xl text-indigo-300">{clan._id}</span>
      </div>
      <div className="flex flex-col ml-4 text-indigo-300 font-bold justify-center">
        Group {clan.name}
      </div>
    </div>
  )
}