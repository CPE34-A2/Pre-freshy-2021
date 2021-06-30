import { Disclosure, Transition } from "@headlessui/react"
import { MenuIcon, TemplateIcon, MapIcon, ChartSquareBarIcon } from "@heroicons/react/outline"

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
          <div className="flex flex-col w-full md:border-r-2 md:w-60 bg-indigo-900">
            {/* Header includes title & logo */}
            <div className="flex flex-row items-center justify-between md:justify-center px-8 md:px-0 py-3 md:py-4 border-b border-gray-7s00">
              <a href="#" className="flex flex-row items-center justify-between focus:outline-none">
                <img src="logo.png" className="w-8 h-8 md:w-10 md:h-10" alt="logo" />
                <span className="text-white font-bold ml-2">PREFRESHY 2021</span>
              </a>
              <Disclosure.Button type="button" className="rounded-lg md:hidden focus:outline-none">
                <MenuIcon className="text-gray-300 w-6 h-6" />
              </Disclosure.Button>
            </div>

            {/* Bigger than mobile nav panel */}
            <>
              <nav className="hidden md:block md:h-full px-4 mt-4">
                {getAllMenus()}
              </nav>

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
              <Disclosure.Panel as="nav" className="md:hidden px-4 pt-4">
                {getAllMenus()}
              </Disclosure.Panel>

              {getProfileBar(user, true)}
            </Transition>
          </div>
        </>
      )}
    </Disclosure>
  )
}