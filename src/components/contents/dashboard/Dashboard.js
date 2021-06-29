import Balance from './Balance'

export default function Dashboard({ displayName, money }) {
  return (
    <div className="">
      <span>{displayName}</span>
      <Balance amount={money} />
    </div>
  )
}