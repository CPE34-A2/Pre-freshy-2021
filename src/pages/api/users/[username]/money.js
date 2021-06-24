import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import User from '@/models/user'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	const user = await User
    .findOne({'username': req.query.username})
    .select('properties.money')
    .lean()
	  .exec()
    
  user.money = user.properties.money
  delete user.properties

  res.status(200).json({user})

})

export default handler