import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method GET
 * @endpoint /api/clan
 * @description Get clan data of current user credentials
 * 
 * @require User credentials
 */
handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'No credentials found' })
	}

	const clan = await Clan
		.findOne({ _id: req.user.clan_id })
		.lean()

	res
		.status(200)
		.json({
			success: true,
			message: clan ? 'Clan data found' : `Can't get clan data because user credentials not found`,
			data: clan || {}
		})
})

export default handler