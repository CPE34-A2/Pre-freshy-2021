import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import User from '@/models/user'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method GET
 * @endpoint /api/clans
 * @description Get all user's data accept only admin role
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	let users = null
	
	const user = User
		.findById(req.user.id)		
		.select('role')
		.lean()
		.exec()

	if (user.role == 'admin') {
		users = await User
			.find()
			.select('-password')
			.lean()
			.exec()
	}

	res.status(200)
		.json({
			sucesss: !!users,
			data: users,
			timestamp: new Date()
		})
})

export default handler