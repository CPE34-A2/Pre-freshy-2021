import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'

import Clan from '@/models/clan'

const handler = nextConnect()

handler
	.use(middleware)
	.use(permission)

/**
 * @method GET
 * @endpoint /api/clans/:id
 * @description Get the clan's data
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	const clanId = req.query.id
	let clan = null

	if (!isNaN(clanId)) {
		clan = await Clan
			.findById(clanId)
			.lean()
			.exec()
	}
	
	res.status(200)
		.json({
			sucesss: !!clan,
			data: clan,
			timestamp: new Date()
		})
})

export default handler