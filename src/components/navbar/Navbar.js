import { Disclosure, Transition } from "@headlessui/react"
import { MenuIcon } from "@heroicons/react/outline"

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Map', href: '#', current: false },
  { name: 'Stock', href: '#', current: false },
]

export default function Navbar() {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <div className="flex flex-col w-full md:border-r-2 md:w-60 bg-white">
            <div className="flex flex-row flex-shrink-0 items-center justify-between mt-2 px-8 pt-4 pb-2">
              <a href="#" className="text-lg font-bold tracking-widest rounded-lg focus:outline-none">PREFRESHY 2021</a>
              <Disclosure.Button type="button" className="rounded-lg md:hidden focus:outline-none">
                <MenuIcon className="w-6 h-6" />
              </Disclosure.Button>
            </div>

            {/* Nav panel greater than md */}
            <nav className="hidden md:block flex-grow px-4 pb-0 overflow-y-auto">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 focus:outline-none">
                  {item.name}
                </a>
              ))}
            </nav>

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
              <Disclosure.Panel as="nav" className="md:hidden px-4 pb-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 focus:outline-none">
                    {item.name}
                  </a>
                ))}
              </Disclosure.Panel>
            </Transition>
          </div>
        </>
      )}
    </Disclosure>
  )
}