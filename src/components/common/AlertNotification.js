import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import * as Util from '@/utils/common'

export default function AlertNotification({ type, info, style }) {
  return info && (
    <div
      className={Util.concatClasses(
        "relative px-4 py-2 text-sm leading-normal rounded-lg",
        style,
        (type == 'success') && 'text-green-700 bg-green-100',
        (type == 'error') && 'text-red-700 bg-red-100'
      )}
      role="alert"
    >
      <span className="absolute inset-y-0 left-0 flex items-center ml-4">
        {(type == 'success') && (
          <CheckCircleIcon className="w-4 h-4 text-green-600" />
        )}

        {(type == 'error') && (
          <ExclamationCircleIcon className="w-4 h-4 text-red-600" />
        )}
      </span>
      <p className="ml-6">{info}</p>
    </div>
  )
}