import * as Util from '@/utils/common'

export default function InputBox(props) {
  return (
    <>
      <input
        placeholder = {props.placeholder} 
        type = {props.type} 
        onChange = {props.onChange} 
        className = {Util.concatClasses(
          'px-3 ring-1 shadow-md focus:outline-none focus:ring-1',
          props.style,
          props.error ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-200 focus:ring-blue-500'
        )}
      />
    </>
  )
}