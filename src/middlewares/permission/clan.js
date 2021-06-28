import User from '@/models/user'
import Clan from '@/models/clan'

export default async function clanPermission(req, res, next) {
  // Login validation with PassportJS
  if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

  // Permission access
  const idFromQuery = req.query.id
  const idFromSession = req.user.clan_id

  const user = await User
      .findById(req.user.id)
      .select('role')
      .lean()
      .exec()

  if (idFromQuery != idFromSession) {
    if (user.role != 'admin') {
      return res.status(403).json({ message: `Sorry but you can't ¯\_(ツ)_/¯` })
    }
  }

  return next()
}