import { useState } from 'react'
import * as Util from '@/utils/common'

export default function InputBox(props) {
  return (
    <input 
      placeholder = {props.placeholder} 
      type = {props.type} 
      onChange = {props.onChange} 
      maxLength = {props.maxLength}
      className = {Util.concatClasses(props.className, props.error && 'ring-2 ring-red-600')}
    />