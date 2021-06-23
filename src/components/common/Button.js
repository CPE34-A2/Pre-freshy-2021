import * as Util from '@/utils/common'

export default function Button(props) {
  return (
    <button 
      type = {props.type} 
      onClick = {props.onClick}
      className = {Util.concatClasses(
        props.style
      )}
    >
      {props.name}
    </button>
  )
}