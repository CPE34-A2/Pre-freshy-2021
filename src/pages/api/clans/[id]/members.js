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
    .findById(req.query.id)
    .select('members')
    .lean()
    .exec()
  
  let members = null

  if (clan) {
    members = await User
      .find({ '_id': { $in: clan.members } })
      .select('-password')
      .lean()
      .exec()
  }

  res
    .status(200)
    .json({
      sucesss: !!members,
      data: members,
      timestamp: new Date()
    })
})

export default handler