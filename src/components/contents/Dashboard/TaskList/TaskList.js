export default function TaskList() {
  return (
    <div className="flex flex-col w-full md:w-auto p-12">
      <div className="flex flex-row gap-x-1 text-xl">
        <div className="font-bold tracking-wider text-indigo-300">Tasks</div>
      </div>

      <div className="flex flex-row mt-4 bg-purple-50 bg-opacity-50 p-5 rounded-2xl shadow-lg">

        <div className="flex space-x-5">
          <div className="flex w-52 h-52 bg-purple-50 rounded-2xl">
            <div className="">
              
            </div>
          </div>

          <div className="flex w-52 h-52 bg-purple-50 rounded-2xl">
            
          </div>

          <div className="flex w-52 h-52 bg-purple-50 rounded-2xl">
            
          </div>
        </div>

      </div>
    </div>
  )
}