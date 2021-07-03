import * as Util from '@/utils/common'

import MoneyImage from '@/publics/money.png'
import GallonImage from '@/publics/gallon.png'
import StarImage from '@/publics/star.png'

import AssetItem from './AssetItem'
import DonateMoneyModal from '../Modals/DonateMoneyModal'
import BuyFuelModal from '../Modals/BuyFuelModal'

export default function AssetsList({ user, clan }) {
  return (
    <>
      <div className="flex flex-row gap-x-1 text-xl">
        <div className="font-extrabold text-purple-400">Assets</div>
        <div className="font-light text-gray-300">List</div>
      </div>

      <div className="flex flex-col w-full md:w-52 mt-4 bg-purple-50 p-5 rounded-2xl shadow-lg">
        <div className="font-medium text-gray-500 mb-2">Your items</div>
        <div className="flex flex-row items-center justify-between">
          <AssetItem
            image={MoneyImage}
            value={Util.numberWithCommas(user.money)}
            unit="coin"
          />

          <DonateMoneyModal user={user} />
        </div>

        <div className="font-medium text-gray-500 mt-4 mb-2">Clan items</div>
        <div className="space-y-4">
          <AssetItem
            image={MoneyImage}
            value={Util.numberWithCommas(clan.properties.money)}
            unit="coin"
          />

          <div className="flex flex-row items-center justify-between">
            <AssetItem
              image={GallonImage}
              value={Util.numberWithCommas(clan.properties.fuel)}
              unit="gallon"
            />

            {(user._id == clan.leader) && <BuyFuelModal clan={clan} />}
          </div>

          <AssetItem
            image={StarImage}
            value={clan.owned_planet_ids.length}
            unit="star"
          />
        </div>
      </div>
    </>
  )
}