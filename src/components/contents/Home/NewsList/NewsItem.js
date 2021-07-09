import Image from 'next/image'
import { useEffect, useState } from 'react'
import * as Util from '@/utils/common'

import moment from 'moment'
import DailyNewsImage from '@/publics/general-news.png'
import BreakingNewsImage from '@/publics/breaking-news.png'
import NewsModal from './NewsModal'

export default function NewsItem({ news }) {
  const newsMap = {
    DISASTER: {
      badge: 'BREAKING NEWS',
      badge_color: 'bg-purple-500',
      img: <Image src={BreakingNewsImage} alt="" />,
    },
    DAILY: {
      badge: 'DAILY NEWS',
      badge_color: 'bg-red-500',
      img: <Image src={DailyNewsImage} alt="" />,
    }
  }

  const [time, setTime] = useState({ locale: '' })

  // Update time every 1 min
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime({ locale: moment(news.createdAt).fromNow() })
    }, 1000 * 60)

    return () => clearInterval(timer)
  }, [time])
  
  return (
    <div className="flex flex-col p-6 md:px-8 bg-white bg-opacity-95 rounded-xl w-full">

      <div className="flex flex-row items-center justify-center space-x-1 md:space-x-2">
        <div className="flex-none w-20 h-20 md:w-24 md:h-24">
          {newsMap[news.category].img}
        </div>

        <div className="flex flex-col space-y-1 w-full">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
              <span 
                className={Util.concatClasses(
                  'font-bold text-base md:text-lg tracking-wide decoration-clone bg-clip-text bg-gradient-to-b text-transparent',
                  (news.category.toUpperCase() == 'DAILY') && 'from-yellow-500 to-red-500',
                  (news.category.toUpperCase() == 'DISASTER') && 'from-red-400 to-red-600'
                )}
              >
                {newsMap[news.category].badge}
              </span>
              <span className="font-light text-xs md:text-base text-gray-700">
                {time.locale}
              </span>
            </div>
            <span className="font-bold text-xl md:text-2xl text-gray-700 mb-1 mt-1 md:mt-0">
              {news.title}
            </span>
          </div>
        </div>
      </div>

      <div className="flex mt-4">
        <NewsModal
          img={newsMap[news.category].img}
          category={news.category}
          title={news.title}
          content={[news.content, news.english_content]}
        />
      </div>

    </div>
  )
}