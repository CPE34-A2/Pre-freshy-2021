export default function Button({ type, name, onClick }) {
  return (
    <button type={type} className="text-white p-2 rounded-lg m-7 mt-9 border-2 bg-red-500 px-5 hover:bg-red-700" onClick={onClick}>
      {name}
    </button>
  )
}
