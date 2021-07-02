import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Planet from '@/models/planet'
import User from '@/models/user'

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

	let planets = null

	const user = await User
		.findById(req.user.id)		
		.select('role')
		.lean()
		.exec()

	if (user.role == 'admin') {
		planets = await Planet
			.find()
			.lean()
			.exec()
	}

	res.status(200)
		.json({
			sucesss: !!planets,
			data: planets,
			timestamp: new Date()
		})
})

export default handler