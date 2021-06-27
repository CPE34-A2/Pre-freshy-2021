export default function credentials(req, res, next) {
  if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

  return next()
}