import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/user'

import User from '@/models/user'
import Clan from '@/models/clan'

const handler = nextConnect()

handler
	.use(middleware)
	.use(permission)

/**
 * @method GET
 * @endpoint /api/users/:id/clan
 * @description Get the data of user's clan
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	const userId = req.query.id
  let clan = null

  if (userId.length == 11 && !isNaN(userId)) {
		const user = await User
			.findById(userId)
			.select('clan_id')
			.lean()
			.exec()

    if (user) {
			clan = await Clan
			.findById(user.clan_id)
			.lean()
			.exec()
    }
  }

	res.status(200)
		.json({
			sucesss: !!clan,
			data: clan,
			timestamp: new Date()
		})
})

export default handler