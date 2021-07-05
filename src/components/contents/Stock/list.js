import React from 'react'
import Itemlist from '@/components/contents/stock/itemlist'
export default function list() {
  return (
    <div className='flex flex-col bg-purple-200 rounded-2xl w-full shadow-2xl '>
      {/* upper list */}
      <div className='rounded-t-2xl bg-purple-500 flex flex-row py-4  w:11/12 md:w-full font-bold text-white text-lg'>
        {/* รายชื่อหมวดหมู่ */}
        <div className='flex-1  md:pl-4 2xl:pl-5  '>
          symbol
        </div>
        <div className='flex-1 md:pl-20 2xl:pl-52'>
          last price
        </div>
        <div className='flex-1 md:pl-4 2xl:pl-44'>
          change | %
        </div>
        <div className='px-2 2xl:px-32 md:px-14'>
          Buy
        </div>
      </div>
      {/* lower list */}
      <div className=''>
        <Itemlist
          symbol="EMCL"
          price="12"
          change="5.02" />
        <Itemlist
          symbol="MINT"
          price="12"
          change="5.02" />
        <Itemlist
          symbol="EMCL"
          price="12"
          change="5.02" />
        <Itemlist
          symbol="EMCL"
          price="12"
          change="5.02" />
        <Itemlist
          symbol="EMCL"
          price="12"
          change="5.02" />

      </div>
    </div>
  )
}
