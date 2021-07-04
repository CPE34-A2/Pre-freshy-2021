import GallonImage from '@/publics/gallon.png'
import StarImage from '@/publics/star.png'

import TaskItem from './TaskItem'

export default function TaskList() {
  return (
    <div className="flex flex-col w-full md:w-auto p-12">
      <div className="flex flex-col mt-4 bg-purple-50 p-5 rounded-2xl shadow-lg">
        <div className="text-xl font-extrabold tracking-wider text-indigo-800 mb-4">TASKS</div>

        <div className="flex flex-col md:flex-row divide-x divide-gray-300 mb-3">
          <TaskItem
            image={GallonImage}
            amount={1}
            unit={'gallon'}
            coin={3}
            accept={{ current: 1, require: 3 }}
            reject={{ current: 2, require: 3 }}
          />

          <TaskItem
            image={StarImage}
            amount={1}
            unit={'gallon'}
            coin={3}
            accept={{ current: 1, require: 3 }}
            reject={{ current: 2, require: 3 }}
          />

          <TaskItem
            image={StarImage}
            amount={1}
            unit={'gallon'}
            coin={3}
            accept={{ current: 1, require: 3 }}
            reject={{ current: 2, require: 3 }}
          />
        </div>
      </div>
    </div>
  )
}