import React from 'react'
import List from '@/components/contents/stock/list'
export default function todayprice() {
  return (
    <>
      <div className='flex h-screen '>
        <div className='flex flex-col w-11/12 md:w-full rounded-2xl p-2  '>
          <h1 className='text-4xl font-black my-9 text-center w-11/12 md:w-full text-purple-400'>♥ TODAY <span className='text-white'>PRICE</span> ♥</h1>
          <List />
        </div>
      </div>
    </>
  )
}
