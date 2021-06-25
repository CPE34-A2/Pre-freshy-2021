import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'
import User from '@/models/user'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}
  
	const clan = await Clan
    .findById(req.query.clanId)
    .lean()
	  .exec()

  const crews = await User
    .find({ '_id': { $in: clan.members.crew_ids } })
    .select('-password')
    .lean()
    .exec()

  res.status(200).json({sucesss: true, data: crews, timestamp: new Date()})

})

export default handler