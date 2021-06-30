import * as Util from '@/utils/common'

import { LogoutIcon } from '@heroicons/react/outline'

export default function ProfileBar({ mobile, username, role }) {
  const roleLocaleMap = {
    user: 'Adventure',
    admin: 'Admin'
  }
  role = roleLocaleMap[role]

  return (
    <div
      className={Util.concatClasses(
        "justify-between items-center w-full px-5 mt-auto bg-indigo-800 h-16 md:h-20",
        mobile ? "flex md:hidden" : "hidden md:flex"
      )}
    >
      <div className="flex items-center">
        <div className="mr-3">
          <img src="/avatar.png" className="w-8 h-8 shadow-md rounded-lg" alt="avatar" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-md font-bold text-indigo-300">{username}</span>
          <span className="text-xs font-light text-gray-300">{role}</span>
        </div>
      </div>

      <div className="flex">
        <a href="/logout" className="hover:bg-indigo-600 hover:shadow-md p-1 rounded-lg">
          <LogoutIcon className="text-white w-5 h-5" />
        </a>
      </div>
    </div>
  )
}