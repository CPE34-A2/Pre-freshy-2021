import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'
import User from '@/models/user'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method GET
 * @endpoint /api/clans/:clanId/leader
 * @description Get the leader's data by the specific clan
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	const clan = await Clan
    .findOne({'_id': req.query.clanId})
    .lean()
	  .exec()

    const leader = await User
    .findById(clan.members.leader_id)
    .select('-password')
    .lean()
    .exec()

  res.status(200).json({leader})

})

export default handler