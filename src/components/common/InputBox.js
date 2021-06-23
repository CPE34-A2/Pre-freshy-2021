import { useState } from 'react'
import * as Util from '@/utils/common'

export default function InputBox(props) {
  return (
    <div>
      <input
        placeholder = {props.placeholder} 
        type = {props.type} 
        onChange = {props.onChange} 
        className = {Util.concatClasses("outline-none ring-2 ring-gray-200 focus:border-opacity-0 rounded-xl p-0.5 pl-1", props.error.isError ? 'ring-red-500 text-red-500' : props.className)}
      />
      {props.error.isError && 
        <p className="text-red-500">
          {props.error.message}  
        </p>
      }
    </div>
  )
}