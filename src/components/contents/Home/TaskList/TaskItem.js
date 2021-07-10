import Image from 'next/image'
import Spinner from '@/components/common/Spinner'
import TaskVoteModal from '../Modals/TaskVoteModal'

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
  if ((typeof receivedItem === 'object') || (typeof lostItem === 'object')) {
    // Stock resolver
    if (receivedItem && receivedItem.symbol) {
      return {
        type: 'stock',
        received: `${receivedItem.amount} ${receivedItem.symbol}`,
        cost: receivedItem.rate * receivedItem.amount
      }
    } else if (lostItem && lostItem.symbol) {
      return {
        type: 'stock',
        received: lostItem.rate * lostItem.amount,
        cost: `${lostItem.amount} ${lostItem.symbol}`
      }
    }

    // Planet resovler
    if (receivedItem && receivedItem.name) {
      return {
        type: 'planet',
        received: receivedItem.name,
        cost: lostItem
      }
    }
  }

  return {
    type: 'fuel',
    received: receivedItem,
    cost: lostItem
  }
}

export default function TaskItem({ user, clan, image, data, locale }) {
  // When fetching the data
  if (!data) return (
    <div className="flex flex-row items-center p-4 bg-gray-700 bg-opacity-10 filter backdrop-blur-3xl rounded-xl">
      <div className="mr-4"><Spinner style="w-11 h-11 text-indigo-200" /></div>
      <div className="font-bold text-gray-300">Loading transaction data from space station...</div>
    </div>
  )

  // If pending transaction is not present
  if (!data.data) {
    return (
      <div className="flex flex-row items-center p-4 bg-gray-600 bg-opacity-20 filter backdrop-blur-md rounded-xl">
        <div className="flex-none w-11 h-11 md:w-14 md:h-14 filter brightness-75 opacity-60">
          <Image src={image} alt="" />
        </div>

        <div className="flex flex-row items-center ml-2 md:ml-4">
          <div className="font-light uppercase text-base xl:text-lg tracking-wide text-gray-300">{locale.not_found}</div>
        </div>
      </div>
    )
  }

  // If pending trasaction is present
  const { confirmer, rejector, confirm_require } = data.data
  const item = resolveTransactionItems(data.data)
  const confirmLeft = confirm_require - Math.max(confirmer.length - 1, rejector.length)

  return (
    <div className="flex flex-row items-center p-4 bg-white bg-opacity-80 rounded-xl">
      <div className="flex-none w-11 h-11 md:w-14 md:h-14">
        <Image src={image} alt="" />
      </div>

      <div className="flex flex-row w-full items-center justify-between ml-2 md:ml-4">
        <div className="flex flex-col">
          <div className="hidden md:flex font-semibold text-base xl:text-sm 2xl:text-base text-gray-800">Request Pending</div>
          <div className="xl:hidden 2xl:flex font-bold text-base xl:text-lg text-center md:text-left uppercase text-indigo-900">{locale.info}</div>
        </div>

        <div className="flex flex-row">
          <div className="hidden lg:flex items-center flex-row text-center ml-3 space-x-6 xl:space-x-4 2xl:space-x-6">
            <div>
              <div className="font-bold text-gray-800 text-base">{locale.received_title}</div>
              <div className="font-bold text-lg xl:text-base 2xl:text-lg text-indigo-700">{item.received} {locale.received_unit}</div>
            </div>
            <div>
              <div className="font-bold text-gray-800 text-base">{locale.cost_title}</div>
              <div className="font-bold text-lg xl:text-base 2xl:text-lg text-indigo-700">{item.cost} {locale.cost_unit}</div>
            </div>
          </div>

          <div className="flex flex-col flex-shrink-0 items-center justify-center ml-2 md:ml-6">
            <TaskVoteModal user={user} clan={clan} image={image} transaction={data.data} item={item} locale={locale} />
            <span className="text-sm mt-1 font-medium text-indigo-800">({confirmLeft} LEFT)</span>
          </div>
        </div>
      </div>
    </div>
  )
}