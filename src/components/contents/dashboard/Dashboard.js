import * as Util from '@/utils/common'

import Image from 'next/image'
import MoneyImage from '@/publics/money.png'
import GallonImage from '@/publics/gallon.png'
import StarImage from '@/publics/star.png'

export default function Dashboard({ user, clan }) {
  return (
    <div className="flex flex-col w-full p-12">

      <div className="flex flex-row gap-x-1 text-xl">
        <div className="font-extrabold text-purple-800">Assets</div>
        <div className="font-light text-gray-600">List</div>
      </div>

      <div className="flex flex-col w-52 mt-4 bg-purple-50 p-5 rounded-2xl shadow-lg">
        <div className="font-medium text-gray-500 mb-2">Your items</div>

        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center drop-shadow-sm">
            <div className="w-10 h-10">
              <Image src={MoneyImage} />
            </div>
          </div>
          <div className="flex flex-col ml-3 leading-none">
            <div className="font-extrabold text-indigo-900">{Util.numberWithCommas(user.properties.money)}</div>
            <div className="font-light text-sm text-indigo-900">coin</div>
          </div>
        </div>

        <div className="font-medium text-gray-500 mt-4 mb-2">Clan items</div>

        <div className="space-y-4">
          <div className="flex flex-row items-center">
            <div className="flex items-center justify-center drop-shadow-sm">
              <div className="w-10 h-10">
                <Image src={GallonImage} />
              </div>
            </div>
            <div className="flex flex-col ml-3 leading-none">
              <div className="font-extrabold text-indigo-900">{Util.numberWithCommas(clan.fuel)}</div>
              <div className="font-light text-sm text-indigo-900">gallon</div>
            </div>
          </div>
          <div className="flex flex-row items-center">
            <div className="flex items-center justify-center drop-shadow-sm">
              <div className="w-10 h-10">
                <Image src={StarImage} />
              </div>
            </div>
            <div className="flex flex-col ml-4 leading-none">
              <div className="font-extrabold text-indigo-900">{clan.owned_planet_ids.length}</div>
              <div className="font-light text-sm text-indigo-900">stars</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}