import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import User from '@/models/user'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method GET
 * @endpoint /api/users/:id
 * @description Get the user's data
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	const userId = req.query.id
	let user = null

	if (userId.length == 11 && !isNaN(userId)) {
		user = await User
		.findById(userId)
		.select('-password')
		.lean()
		.exec()
	}
	res.status(200)
		.json({
			sucesss: !!user,
			data: user,
			timestamp: new Date()
		})
})

export default handler