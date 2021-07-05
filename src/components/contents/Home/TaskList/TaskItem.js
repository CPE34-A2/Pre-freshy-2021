import Image from 'next/image'
import Spinner from '@/components/common/Spinner'

//  owenr -> receriver -> [received items, lost items]
const transactionMap = {
  clan: {
    clan: ['fuel', 'money'],
    market: ['stock', 'money']
  },
  market: {
    clan: ['money', 'stock']
  },
  planet: {
    clan: ['planet', 'fuel']
  }
}

const resolveTransactionItems = (data) => {
  const bill = transactionMap[data.owner.type][data.receiver.type]

  const receivedItem = data.item[bill[0]]
  const lostItem = data.item[bill[1]]

  // Resolve stock or planet
  if ((typeof receivedItem === 'object')) {
    // Stock resolver
    if (receivedItem.symbol) {
      return {
        received: receivedItem.symbol,
        cost: receivedItem.rate * receivedItem.amount
      }
    }

    // Planet resovler
    if (receivedItem.name) {
      return {
        received: receivedItem.name,
        cost: lostItem
      }
    }
  }

  return {
    received: receivedItem,
    cost: lostItem
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
        <div className="flex-none w-12 h-12 md:w-14 md:h-14">
          <Image src={image} alt="" />
        </div>

        <div className="flex flex-row w-full items-center justify-between ml-2 md:ml-4 md:px-12">
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
    <div className="flex flex-row py-3 items-center bg-indigo-600 px-4 rounded-2xl shadow-md hover:shadow-none">
      <div className="flex-none w-12 h-12 md:w-14 md:h-14">
        <Image src={image} alt="" />
      </div>

      <div className="flex flex-row w-full items-center justify-between ml-2 md:ml-4">
        <div className="flex flex-col">
          <div className="hidden md:flex font-thin text-gray-200 text-sm">Transaction Pending</div>
          <div className="font-medium text-white">{locale.info}</div>
        </div>

        <div className="flex flex-row">
          <div className="hidden md:flex items-center flex-row text-center ml-3 lg:ml-8 space-x-6">
            <div>
              <div className="font-thin text-gray-200 text-sm">{locale.received_title}</div>
              <div className="font-medium text-white">{item.received} {locale.received_unit}</div>
            </div>
            <div>
              <div className="font-thin text-gray-200 text-sm">{locale.cost_title}</div>
              <div className="font-medium text-white">{item.cost} {locale.cost_unit}</div>
            </div>
          </div>

          <div className="flex flex-col items-center ml-2 md:ml-6">
            <button className="rounded-lg px-4 bg-pink-300 hover:bg-pink-400 ring-1 text-sm md:text-base hover:animate-pulse text-pink-800 hover:text-pink-900 shadow-md font-bold">
              VOTE
            </button>
            <span className="text-xs mt-1 font-medium text-gray-200">({confirmLeft} left)</span>
          </div>
        </div>
      </div>
    </div>
  )
}