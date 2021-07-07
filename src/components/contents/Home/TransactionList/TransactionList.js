import TransactionItem from './TransactionItem'

export default function TransactionList() {
  return (
    <div className="flex flex-col h-full bg-gray-300 bg-opacity-40 filter backdrop-blur-3xl p-5 rounded-2xl shadow-lg overflow-y-auto">
      <div className="text-2xl font-bold tracking-wider text-white mb-4">TRANSACTIONS LOG</div>

      <div className="overflow-y-auto space-y-4">
        <TransactionItem />
        <TransactionItem />
        <TransactionItem />
      </div>
    </div>
  )
}