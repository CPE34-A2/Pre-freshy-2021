import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Planet from '@/models/planet'

const handler = nextConnect()

handler
	.use(middleware)

/**
 * @method GET
 * @endpoint /api/planets/:id
 * @description Get the clan's data
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	const planetId = req.query.id
	let planet = null

	if (!isNaN(planetId)) {
		planet = await Planet
			.findById(planetId)
      .select('-quest -redeem')
			.lean()
			.exec()
	}
	
	res.status(200)
		.json({
			sucesss: !!planet,
			data: planet,
			timestamp: new Date()
		})
})

export default handler