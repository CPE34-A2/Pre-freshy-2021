import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method GET
 * @endpoint /api/clans/:clanId/money
 * @description Get the total money of the clan
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}
	let clan = null
	if (!isNaN(req.query.id)){
		clan = await Clan
		.findById(req.query.id)
		.select('properties.money')
		.lean()
		.exec()
	}
	res.status(200)
		.json({
			sucesss: !!clan,
			data: clan && clan.properties.money,
			timestamp: new Date()
		})
})

export default handler