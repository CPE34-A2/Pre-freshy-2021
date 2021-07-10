import { useEffect, useState } from "react"
import fetchAPI from '@/utils/fetch'

export default function BattleList({ user, clan }) {
  const [battle, setBattle] = useState('')

  return (
    <div className="flex flex-col w-full h-full bg-gray-300 bg-opacity-40 filter backdrop-blur-3xl p-5 rounded-2xl shadow-lg">
      <div className="text-2xl font-bold tracking-wider text-white mb-4">BATTLE</div>

      <div className="overflow-y-auto space-y-4">

      </div>
    </div>
  )
}