import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import User from '@/models/user'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method GET
 * @endpoint /api/users/:id/properties
 * @description Get the user's properties
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	let user = null

	if (req.query.id.length == 11 && !isNaN(req.query.id)) {
		user = await User
			.findById(req.query.id)
			.select('properties')
			.lean()
			.exec()
	}

	res.status(200)
		.json({
			sucesss: !!user,
			data: user && user.properties,
			timestamp: new Date()
		})
})

export default handler