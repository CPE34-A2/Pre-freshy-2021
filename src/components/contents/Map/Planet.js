import Image from "next/image"
import PlanetPopOver from "./PlanetPopOver"
import { useState } from "react"
import PlanetModal from "./PlanetModal"
import * as Util from '@/utils/common'

const PLANET_COLOR = ['', 'star-pink', 'star-orange', 'star-yellow', 'star-green', 'star-light-blue', 'star-blue', 'star-purple']

export default function Planet({ user, clan, planet, image, className }) {
  const [isHover, setIsHover] = useState(false)
  const [isClick, setIsClick] = useState(false)
  
  const shield = (planet.visitor != 0 && planet.tier != 'HOME') && 'ring-blue-300 ring-4 rounded-full'
  const pulse = ((planet._id == clan.position && planet.tier != 'HOME' && planet.tier != 'X') || (planet.owner == clan._id && planet.visitor != 0)) && 'animate-pulse filter brightness-150'

  const openPopOver = () => setIsHover(true)
  const closePopOver = () => setIsHover(false)
  const openModal = () => setIsClick(true)
  const closeModal = () => setIsClick(false)

  return (
    <div className="flex justify-center">
      <PlanetPopOver clan={clan} planet={planet} isHover={isHover} />
      <PlanetModal user={user} conquerColor={PLANET_COLOR[clan._id]} clan={clan} planet={planet} image={image} isModalOpen={isClick} close={closeModal} />
      <div onMouseEnter={openPopOver} onMouseLeave={closePopOver} onClick={openModal} className={Util.concatClasses('cursor-pointer', shield, className, PLANET_COLOR[planet.owner], pulse)}>
        <Image className={Util.concatClasses("select-none", isHover && 'animate-pulse')} src={image} alt="" />
      </div>
    </div>
  )
}