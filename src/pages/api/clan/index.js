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
		.findById(req.user.id)
		.select('clan_id')
		.exec()

	const clan = await Clan
		.findOne({ _id: user.clan_id })
		.exec()

	res.status(200).json(clan)
})

export default handler