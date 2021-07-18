import Dashboard from '@/components/common/Dashboard'

import { useEffect, useState } from 'react'

export default function Stock({ user, clan }) {

  return (
    <Dashboard current="leaderboard" user={user} clan={clan}>
      <div className="w-full h-full flex flex-col items-center justify-center scale-95 md:scale-75 lg:scale-90 2xl:scale-100">

      </div>
    </Dashboard>
  )
}