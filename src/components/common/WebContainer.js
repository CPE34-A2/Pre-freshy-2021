import * as Util from '@/utils/common'

export default function WebContainer(props) {
  return (
    <div 
      className={Util.concatClasses(
        'flex flex-col h-screen justify-between',
        props.style
      )}
    >
      {props.children}
    </div>
  )
}