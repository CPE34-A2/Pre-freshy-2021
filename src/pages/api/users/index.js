import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import User from '@/models/user'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	const users = await User
		.find()
		.select('-password')
		.lean()
		.exec()

	res.status(200)
		.json({
			sucesss: true,
			data: users,
			timestamp: new Date()
		})

})

export default handler