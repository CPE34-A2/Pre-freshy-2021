import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method GET
 * @endpoint /api/clans/:clanId
 * @description Get the specific clan's data
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	const clan = await Clan
  	.findById(req.query.id)
  	.lean()
		.exec()
	
	res.status(200)
		.json({
			sucesss: true, 
			data: clan, 
			timestamp: new Date()
		})
})

export default handler