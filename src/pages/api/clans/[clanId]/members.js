import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'
import User from '@/models/user'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method GET
 * @endpoint /api/clans/:clanId/members
 * @description Get the members' data by the specific clan
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	const clan = await Clan
    .findById(req.query.clanId)
    .lean()
		.exec()

  const member_ids = [clan.members.leader_id]
  clan.members.crew_ids.forEach((element)=>{member_ids.push(element)})

    const members = await User
      .find({ '_id': { $in: member_ids } })
      .select('-password')
      .lean()
      .exec()

    res.status(200)
      .json({
        sucesss: true, 
        data: members, 
        timestamp: new Date()
      })

})

export default handler