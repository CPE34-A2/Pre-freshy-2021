import PlanetHomeImage from '@/publics/planets/Home.png'
import PlanetDImage from '@/publics/planets/D.png'
import PlanetCImage from '@/publics/planets/C.png'
import PlanetBImage from '@/publics/planets/B.png'
import PlanetXImage from '@/publics/planets/X.png'
import PlanetSImage from '@/publics/planets/The_one_BnW.png'

import BattleModal from '../Modals/BattleModal'
import Image from 'next/image'
import * as Util from '@/utils/common'

const tierMap = Array(42)
  .fill('h', 0, 7)
  .fill('d', 7, 21)
  .fill('c', 21, 29)
  .fill('b', 29, 32)
  .fill('x', 32, 41)
  .fill('s', 41)

const planetMap = {
  h: { img: PlanetHomeImage },
  d: { img: PlanetDImage },
  c: { img: PlanetCImage },
  b: { img: PlanetBImage },
  x: { img: PlanetXImage },
  s: { img: PlanetSImage }
}

const planetColorMap = ['star-pink', 'star-orange', 'star-yellow', 'star-green', 'star-light-blue', 'star-blue', 'star-purple']

export default function BattleItem({ user, clan, data }) {
  const isAttackerIsMe = (clan._id == data.attacker)

  const planetId = data.target_planet_id
  const planetData = planetMap[tierMap[planetId - 1]]
  const planetColor = planetColorMap[data.defender - 1]

  const currentPhase = data.current_phase
  const targetClanName = Util.getClanName(isAttackerIsMe ? data.defender : data.attacker)

  var phaseData = {}

  if (currentPhase != 3 && currentPhase != 0) {
    phaseData = data[`phase0${currentPhase}`]
    var currentProgress = Math.max(phaseData.confirmer.length - (+(currentPhase == 1)), phaseData.rejector.length)

    phaseData.confirm_require = data.confirm_require
    phaseData.isAttackerIsMe = isAttackerIsMe
  }

  phaseData.id = data._id
  phaseData.current = currentPhase

  let waitingText

  if (currentPhase == 1) {
    waitingText = isAttackerIsMe ? 'crewmate' : 'attacker'
  } else if (currentPhase == 2) {
    waitingText = isAttackerIsMe ? 'defender' : 'crewmate'
  }

  return (
    <div className="flex flex-col flex-grow items-center justify-between bg-white bg-opacity-30 h-full rounded-xl py-5 px-3">
      <div className="flex flex-col items-center text-center">
        <div className="mx-auto text-indigo-900 font-bold text-base bg-gray-200 px-2 rounded-lg">
          {isAttackerIsMe ? 'ATTACKER' : 'DEFENDER'}
        </div>

        {(currentPhase == 1 || (currentPhase == 2 && data.status != 'DENIED')) && (
          <p className="text-gray-700 text-sm lg:text-base font-semibold mt-1">
            waiting for {waitingText}
          </p>
        )}

        {(data.status == 'DENIED') && (
          <p className="text-gray-700 text-sm lg:text-base font-semibold mt-1">
            defender surrender
          </p>
        )}

        {(currentPhase == 3) && (
          <p className="text-gray-700 text-lg font-semibold mt-1">
            battling...
          </p>
        )}

        {(currentPhase == 0) && (
          <p className="text-gray-700 text-lg font-semibold mt-1">
            {data.status}
          </p>
        )}

        {(currentPhase != 3 && currentPhase != 0) && <p className="text-gray-700 text-sm lg:text-base  font-medium">({currentProgress}/3)</p>}

        <div className="font-medium text-indigo-800 lg:text-lg">{targetClanName}</div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex w-24 h-24">
          <Image className={planetColor} src={planetData.img} alt="" />
        </div>

        <div className="flex flex-col items-center text-center leading-none">
          <div className="font-semibold lg:text-lg">#{planetId}</div>
        </div>
      </div>

      <div className="mt-2 w-full">
        {(data.status != 'DENIED') && (
          <BattleModal
            planet={data}
            img={{ src: planetData.img, color: planetColor }}
            targetClanName={targetClanName}
            user={user}
            phaseData={phaseData}
            isLeader={user._id == clan.leader}
          />
        )}
      </div>
    </div>
  )
}