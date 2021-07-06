import StockItem from '@/components/contents/Stock/StockItem'

export default function StockList({ clan, stocks }) {
  return (
    <div className='flex flex-col bg-purple-100 rounded-2xl w-full shadow-2xl '>
      {/* upper list */}
      <div className='text-center rounded-t-2xl bg-indigo-700 flex flex-row py-4 px-6 w-full font-semibold text-white text-lg'>
        {/* รายชื่อหมวดหมู่ */}
        <div className='flex-1  md:pl-4 2xl:pl-5  '>
          Symbol
        </div>
        <div className='flex-1 md:pl-20 2xl:pl-52'>
          Last
        </div>
        <div className='flex-1 md:pl-4 2xl:pl-44'>
          Change
        </div>
        <div className='px-2 2xl:px-32 md:px-14'>
          Manage
        </div>
      </div>
      {/* lower list */}
      <div className='px-6 text-center'>

        {stocks && stocks.map(stock => (
          <StockItem
            key={stock.symbol}
            clan={clan}
            data={stock}
          />
        ))}
      </div>
    </div>
  )
}
