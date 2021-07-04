import { useState } from 'react'

import middleware from '@/middlewares/middleware'
import useSocket from '@/hooks/useSocket'
import { getUser } from '@/pages/api/users/[id]/index'

import Stock from '@/components/contents/Stock/Stock'

export default function StockPage({ user }) {
  return (
    <Stock
      current="stock"
      user={user}
    />
  )
}

export async function getServerSideProps({ req, res }) {
  try {
    await middleware.run(req, res)

    if (!req.isAuthenticated()) {
      return { redirect: { destination: '/login', permanent: false } }
    }

    const user = await getUser(req.user.id)

    delete user.__v
    
    return { props: { user: user } }
  } catch (error) {
    console.log(error.message)
  }
}
