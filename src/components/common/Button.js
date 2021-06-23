export default function Button(props) {
  return (
    <button 
      className="text-white p-2 rounded-lg m-7 mt-9 border-2 bg-red-500 px-5 hover:bg-red-700" 
      type={props.type} 
      onClick={props.onClick}
    >
      {props.name}
    </button>
  )
}
