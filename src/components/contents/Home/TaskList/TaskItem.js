import Image from 'next/image'
import Spinner from '@/components/common/Spinner'

//  owenr -> receriver -> [received items, lost items]
const transactionMap = {
  clan: {
    clan: ['fuel', 'money'],
    market: ['stock', 'money',]
  },
  market: {
    clan: ['money', 'stock']
  },
  planet: {
    clan: ['planets', 'fuel']
  }
}

const resolveTransactionItems = (data) => {
  const bill = transactionMap[data.owner.type][data.receiver.type]
  return {
    received: data.item[bill[0]],
    cost: data.item[bill[1]]
  }
}

export default function TaskItem({ image, data, locale }) {
  // When fetching the data
  if (!data) return (
    <div className="flex flex-row py-3 items-center bg-indigo-500 px-4 rounded-2xl">
      <div className="mr-4"><Spinner style="w-14 h-14 text-indigo-200" /></div>
      <div className="font-bold text-gray-300">Loading transaction data from space station...</div>
    </div>
  )

  // If pending transaction is not present
  if (!data.data) {
    return (
      <div className="flex flex-row py-3 items-center bg-indigo-500 px-4 rounded-2xl opacity-70">
        <div className="flex-none w-14 h-14">
          <Image src={image} alt="" />
        </div>

        <div className="flex flex-row w-full items-center justify-between ml-4">
          <div className="font-semibold text-gray-200">{locale.not_found}</div>
        </div>
      </div>
    )
  }
  // If pending trasaction is present
  const { confirmer, rejector, confirm_require } = data.data
  const item = resolveTransactionItems(data.data)
  const confirmLeft = confirm_require - Math.max(confirmer.length, rejector.length)

  return (
    <div className="flex flex-row py-3 items-center bg-indigo-600 opacity-95 hover:opacity-100 px-4 rounded-2xl">
      <div className="flex-none w-14 h-14">
        <Image src={image} alt="" />
      </div>

      <div className="flex flex-row w-full items-center justify-between ml-4">
        <div className="flex flex-col">
          <div className="font-thin text-gray-200 text-sm">Transaction Pending</div>
          <div className="font-medium text-white">{locale.info}</div>
        </div>

        <div className="flex flex-row text-center ml-8 space-x-4">
          <div>
            <div className="font-thin text-gray-200 text-sm">{locale.received_title}</div>
            <div className="font-medium text-white">{item.received} {locale.received_unit}</div>
          </div>
          <div>
            <div className="font-thin text-gray-200 text-sm">{locale.cost_title}</div>
            <div className="font-medium text-white">{item.cost} {locale.cost_unit}</div>
          </div>
        </div>

        <div className="flex flex-col items-center ml-6">
          <button className="rounded-lg px-4 bg-purple-200 hover:bg-purple-300 text-indigo-800 hover:text-indigo-900 shadow-md font-bold">
            VOTE
          </button>
          <span className="text-xs mt-1 font-medium text-gray-200">({confirmLeft} left)</span>
        </div>
      </div>
    </div>
  )
}