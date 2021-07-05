import Image from "next/image"
import PlanetPopOver from "./PlanetPopOver"
import { useState } from "react"
import PlanetModal from "./PlanetModal"

export default function Planet({planet, image, className}) {
  const [isHover, setIsHover] = useState(false)
  const [isClick, setIsClick] = useState(false)

  const openPopOver = () => setIsHover(true)
  const closePopOver = () => setIsHover(false)
  const openModal = () => setIsClick(true)
  const closeModal = () => setIsClick(false)

  return (
    <div className="flex justify-center">
      <PlanetPopOver planet={planet} isHover={isHover} />
      <PlanetModal planet={planet} image={image} isOpen={isClick} close={closeModal}/>
      <div className={className} onMouseEnter={openPopOver} onMouseLeave={closePopOver} onClick={openModal}>
        <Image src={image} alt="" />
      </div>
    </div>
  )
}