import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method GET
 * @endpoint /api/clans
 * @description Get all clans' data
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	const clans = await Clan
		.find()
		.lean()
		.exec()

	res.status(200)
		.json({
			sucesss: true,
			data: clans,
			timestamp: new Date()
		})
})

export default handler