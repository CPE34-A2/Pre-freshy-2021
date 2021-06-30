import { Disclosure, Transition } from "@headlessui/react"
import { MenuIcon, TemplateIcon, MapIcon, ChartSquareBarIcon } from "@heroicons/react/outline"

import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/publics/logo.png'

import NavMenu from './NavMenu'
import ProfileBar from './ProfileBar'

const navigation = [
  { name: 'Dashboard', icon: <TemplateIcon className="w-5 h-5 mr-3" />, href: '#', current: true },
  { name: 'Map', icon: <MapIcon className="w-5 h-5 mr-3" />, href: '#', current: false },
  { name: 'Stock', icon: <ChartSquareBarIcon className="w-5 h-5 mr-3" />, href: '#', current: false },
]

const getAllMenus = () => {
  return navigation.map((item) => (
    <NavMenu
      key={item.name}
      name={item.name}
      href={item.href}
      current={item.current}
      icon={item.icon}
    />
  ))
}

const getProfileBar = (user, mobile) => {
  return (
    <ProfileBar
      username={user._id}
      role={user.role}
      mobile={mobile}
    />
  )
}

export default function Navbar({ user }) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <div className="flex flex-col w-full md:w-60 bg-indigo-900">
            {/* Header includes title & logo */}
            <div className="flex flex-row items-center justify-between md:justify-center px-8 md:px-0 py-3 md:py-4">
              <a href="#" className="flex flex-row items-center justify-between focus:outline-none">
                <div className="w-8 h-8 md:w-10 md:h-10">
                  <Image
                    src={Logo}
                    alt="Pre-freshy 2021 Logo"
                  />
                </div>
                <span className="text-white font-bold ml-2">PREFRESHY 2021</span>
              </a>
              <Disclosure.Button type="button" className="rounded-lg md:hidden focus:outline-none">
                <MenuIcon className="text-gray-300 w-6 h-6" />
              </Disclosure.Button>
            </div>

            {/* Bigger than mobile nav panel */}
            <>
              <div className="hidden md:block md:h-full px-4">
                <nav className="border-t border-indigo-700 py-4">
                  {getAllMenus()}
                </nav>
              </div>

              {getProfileBar(user, false)}
            </>

            {/* Mobile nav panel */}
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform -translate-y-8 opacity-0"
              enterTo="opacity-100"
              leave="transition duration-50 ease-out"
              leaveFrom="opacity-100"
              leaveTo="transform -translate-y-4 opacity-0"
            >
              <Disclosure.Panel className="md:hidden px-4">
                <nav className="border-t border-indigo-700 pt-4 pb-1">
                  {getAllMenus()}
                </nav>
              </Disclosure.Panel>

              {getProfileBar(user, true)}
            </Transition>
          </div>
        </>
      )}
    </Disclosure>
  )
}