import * as Util from '@/utils/common'

import MoneyImage from '@/publics/money.png'
import GallonImage from '@/publics/gallon.png'
import StarImage from '@/publics/star.png'

import AssetItem from './AssetItem'
import DonateMoneyModal from '../Modals/DonateMoneyModal'
import BuyFuelModal from '../Modals/BuyFuelModal'

export default function AssetsList({ user, clan }) {
  return (
    <div className="flex flex-col h-full bg-gray-200 bg-opacity-30 filter backdrop-blur-xl p-5 rounded-2xl shadow-lg">
      <div className="text-2xl font-bold tracking-wider text-white mb-4">ASSETS</div>

      <div className="font-medium text-lg text-gray-400 mb-2">Your items</div>
      <div className="flex flex-col mb-4">
        <AssetItem
          image={MoneyImage}
          value={Util.numberWithCommas(user.money)}
          unit="coin"
          sideButton={<DonateMoneyModal user={user} />}
        />
      </div>

      <div className="font-medium text-lg text-gray-400 mb-2">Clan items</div>
      <div className="flex flex-col space-y-4">
        <AssetItem
          image={MoneyImage}
          value={Util.numberWithCommas(clan.properties.money)}
          unit="coin"
        />

        <AssetItem
          image={GallonImage}
          value={Util.numberWithCommas(clan.properties.fuel)}
          unit="gallon"
          sideButton={(user._id == clan.leader) && <BuyFuelModal clan={clan} />}
        />

        <AssetItem
          image={StarImage}
          value={clan.owned_planet_ids.length}
          unit="planet"
        />
      </div>
    </div>
  )
}