import Image from 'next/image'

import * as Util from '@/utils/common'
import DialyNewsImage from '@/publics/general-news.png'
import BreakingNewsImage from '@/publics/breaking-news.png'
import NewsModal from './NewsModal'

export default function NewsItem({ news }) {
  const newsMap = {
    DISASTER: {
      badge: 'BREAKING NEWS',
      badge_color: 'bg-purple-500',
      img: <Image src={BreakingNewsImage} alt="" />,
    },
    DIALY: {
      badge: 'DIALY NEWS',
      badge_color: 'bg-red-500',
      img: <Image src={DialyNewsImage} alt="" />,
    }
  }

  console.log(news.category)

  return (
    <div className="flex flex-col p-6 bg-white bg-opacity-60 hover:bg-opacity-80 filter backdrop-blur-3xl rounded-xl">

      <div className="flex flex-row items-center">
        <div className="w-24 h-24">
          {newsMap[news.category].img}
        </div>

        <div className="flex flex-col ml-4 space-y-1">
          <div className="flex font-bold text-indigo-700">
            <div
              className={Util.concatClasses(
                'flex flex-shrink flex-grow-0 font-medium rounded-xl px-4 text-white text-sm',
                newsMap[news.category].badge_color
              )}
            >
              {newsMap[news.category].badge}
            </div>
          </div>

          <div className="flex font-bold text-xl text-indigo-700">
            {news.title}
          </div>
        </div>
      </div>

      <div className="flex flex-row text-lg text-gray-600 p-4">
        <div className="h-32 overflow-y-hidden">
          {news.content}
        </div>
      </div>

      <div className="flex mt-4">
        <NewsModal 
          img={newsMap[news.category].img}
          title={news.title}
          content={[news.content, news.english_content]}
        />
      </div>

    </div>
  )
}