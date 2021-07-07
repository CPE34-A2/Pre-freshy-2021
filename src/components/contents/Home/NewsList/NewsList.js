import fetchAPI from '@/utils/fetch'
import { useState, useEffect } from 'react'
import NewsItem from './NewsItem'

export default function NewsList() {
  const [news, setNews] = useState('')

  useEffect(() => {
    fetchAPI('GET', '/api/news?firstIndex=0&lastIndex=10')
      .then(res => res.json())
      .then(data => setNews(data.data))
  }, [])

  return (
    <div className="flex flex-col h-full bg-gray-300 bg-opacity-40 filter backdrop-blur-3xl p-5 rounded-2xl shadow-lg">
      <div className="text-2xl font-bold tracking-wider text-white mb-4">NEWS</div>

      <div className="overflow-y-auto space-y-6">
        {news && news.map(item => (
          <NewsItem
            key={item._id}
            news={item}
          />
        ))}
      </div>
    </div>
  )
}