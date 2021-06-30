import { CurrencyDollarIcon, BeakerIcon, StarIcon } from '@heroicons/react/outline'

export default function Dashboard({ user }) {
  return (
    <div className="flex flex-col w-full p-12">

      <div className="flex flex-row gap-x-1 text-xl">
        <div className="font-extrabold text-purple-800">Assets</div>
        <div className="font-light text-gray-600">List</div>
      </div>

      <div className="flex flex-col w-52 mt-4 bg-purple-50 p-4 rounded-2xl shadow-lg">
        <div className="font-medium text-gray-500 mb-2">Your items</div>

        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow">
            <CurrencyDollarIcon className="w-8 h-8" />
          </div>
          <div className="flex flex-col ml-4 leading-none">
            <div className="font-extrabold text-indigo-900">1,500</div>
            <div className="font-light text-sm text-indigo-900">coin</div>
          </div>
        </div>

        <div className="font-medium text-gray-500 mt-4 mb-2">Clan items</div>

        <div className="space-y-4">
          <div className="flex flex-row items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow">
              <BeakerIcon className="w-8 h-8" />
            </div>
            <div className="flex flex-col ml-4 leading-none">
              <div className="font-extrabold text-indigo-900">320</div>
              <div className="font-light text-sm text-indigo-900">gallon</div>
            </div>
          </div>
          <div className="flex flex-row items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow">
              <StarIcon className="w-8 h-8" />
            </div>
            <div className="flex flex-col ml-4 leading-none">
              <div className="font-extrabold text-indigo-900">4</div>
              <div className="font-light text-sm text-indigo-900">stars</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}