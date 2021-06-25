import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import User from '@/models/user'
import Clan from '@/models/clan'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	const user = await User
		.findById(req.query.id)
		.select('clan_id')
		.lean()
		.exec()

	const clan = await Clan
		.findById(user.clan_id)
		.lean()
		.exec()

	res.status(200)
		.json({
			sucesss: true,
			data: clan,
			timestamp: new Date()
		})
})

export default handler