import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import User from '@/models/user'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}
	
	let user = null

	if (req.query.id.length == 11 && !isNaN(req.query.id)) {
		user = await User
		.findById(req.query.id)
		.select('properties.money')
		.lean()
		.exec()
	}
	res.status(200)
		.json({
			sucesss: !!user,
			data: user && user.properties.money,
			timestamp: new Date()
		})
})

export default handler