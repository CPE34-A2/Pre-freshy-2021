import { ExclamationCircleIcon } from '@heroicons/react/outline'
import * as Util from '@/utils/common'

export default function AlertNotification({ error, style }) {
  return error && (
    <div
      className={Util.concatClasses(
        "relative px-4 py-2 text-sm leading-normal text-red-700 bg-red-100 rounded-lg",
        style
      )}
      role="alert"
    >
      <span className="absolute inset-y-0 left-0 flex items-center ml-4">
        <ExclamationCircleIcon className="w-4 h-4 text-red-600" />
      </span>
      <p className="ml-6">{error}</p>
    </div>
  )
}