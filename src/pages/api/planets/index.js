import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Planet from '@/models/planet'

const handler = nextConnect()

handler
	.use(middleware)

/**
 * @method GET
 * @endpoint /api/planets
 * @description Get all planets' data only admin role
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	const	planets = await Planet
			.find()
			.select('-quest -redeem')
			.lean()
			.exec()
	
	res.status(planets ? 200 : 400)
		.json({
			sucesss: !!planets,
			data: planets,
			timestamp: new Date()
		})
})

export default handler