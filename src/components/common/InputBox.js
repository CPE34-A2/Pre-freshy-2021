import * as Util from '@/utils/common'

export default function InputBox(props) {
  return (
    <>
      <input
        name = {props.name}
        ref = {props.ref}
        placeholder = {props.placeholder} 
        type = {props.type}
        maxLength = {props.maxLength}
        pattern = {props.pattern}
        value = {props.value}
        onChange = {props.onChange} 
        className = {Util.concatClasses(
          'px-3 ring-1 focus:outline-none focus:ring-1 appearance-none',
          props.style,
          props.error ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-200 focus:ring-purple-600'
        )}
      />
    </>
  )
}