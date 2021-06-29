import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'
import User from '@/models/user'

const handler = nextConnect()

handler
	.use(middleware)

/**
 * @method GET
 * @endpoint /api/clans
 * @description Get all clans' data only admin role
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	let clans = null

	const user = await User
		.findById(req.user.id)		
		.select('role')
		.lean()
		.exec()

	if (user.role == 'admin') {
		clans = await Clan
			.find()
			.lean()
			.exec()
	}

	res.status(200)
		.json({
			sucesss: !!clans,
			data: clans,
			timestamp: new Date()
		})
})

export default handler