import User from '@/models/user'

export default async function permission(req, res, next) {
  // Login validation with PassportJS
  if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

  // Permission access
  const idFromQuery = req.query.id
  const idFromSession = req.user.id

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

  return next()
}