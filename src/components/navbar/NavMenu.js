import * as Util from '@/utils/common'

export default function NavMenu({ name, href, current, icon }) {
  return (
    <a
      href={href}
      className={Util.concatClasses(
        "block px-4 py-2 mb-2 text-indigo-300 text-sm font-semibold focus:outline-none",
        current && "bg-indigo-700 text-indigo-100 rounded-lg"
      )}
    >
      <div className="flex flex-row items-center">{icon} {name}</div>
    </a>
  )
}