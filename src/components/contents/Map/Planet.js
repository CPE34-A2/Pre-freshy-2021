import Image from "next/image"
import PlanetPopOver from "./PlanetPopOver"
import { useState } from "react"
import PlanetModal from "./PlanetModal"
import * as Util from '@/utils/common'

const PLANET_COLOR = ['', 'star-pink', 'star-orange', 'star-yellow', 'star-green', 'star-light-blue', 'star-blue', 'star-purple']

export default function Planet({ clan, planet, image, className}) {
  const [isHover, setIsHover] = useState(false)
  const [isClick, setIsClick] = useState(false)

  const openPopOver = () => setIsHover(true)
  const closePopOver = () => setIsHover(false)
  const openModal = () => setIsClick(true)
  const closeModal = () => setIsClick(false)

  return (
    <div className="flex justify-center">
      <PlanetPopOver clan={clan} planet={planet} isHover={isHover} />
      <PlanetModal clan={clan} planet={planet} image={image} isOpen={isClick} close={closeModal}/>
      <div className={Util.concatClasses(className, PLANET_COLOR[planet.owner])} onMouseEnter={openPopOver} onMouseLeave={closePopOver} onClick={openModal}>
        <Image className="select-none" src={image} alt="" />
      </div>
    </div>
  )
}