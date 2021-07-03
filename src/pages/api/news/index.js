import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import News from '@/models/news'

const handler = nextConnect()

handler
	.use(middleware)

/**
 * @method GET
 * @endpoint /api/news
 * @description Get the news
 * 
 * @param firstIndex
 * @param lastIndex
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	const firstIndex = parseInt(req.query.firstIndex) || 0
	const lastIndex = parseInt(req.query.lastIndex) || 0
	let news = null

	if (firstIndex >= 0 && lastIndex > 0 && lastIndex - firstIndex > 0){
		news = await News
			.find()
			.sort({'updatedAt': -1})
			.select()
			.skip(firstIndex)
			.limit(lastIndex - firstIndex + 1)
			.lean()
			.exec()
	}

	res.status(news ? 200 : 400)
		.json({
			sucesss: !!news,
			data: news,
			timestamp: new Date()
		})
})

export default handler