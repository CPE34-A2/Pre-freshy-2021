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

  if (idFromQuery != idFromSession) {
    const user = await User
      .findById(idFromSession)
      .select('role')
      .lean()
      .exec()

    if (user.role != 'admin') {
      return res.status(403).json({ message: `Sorry but you can't ¯\_(ツ)_/¯` })
    }
  }

  // Clan leader check
  const clan = await Clan
    .findById(idFromQuery)
    .select('leader')
    .lean()
    .exec()

  if (clan.leader != req.user.id) {
    return res.status(403).json({ message: `You are't clan leader` })
  }
  
  return next()
}