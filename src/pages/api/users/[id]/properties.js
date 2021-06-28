import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/user'

import User from '@/models/user'

const handler = nextConnect()

handler
	.use(middleware)
	.use(permission)

/**
 * @method GET
 * @endpoint /api/users/:id/properties
 * @description Get the user's properties
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	const userId = req.query.id
	let user = null

	if (userId.length == 11 && !isNaN(userId)) {
		user = await User
			.findById(userId)
			.select('properties')
			.lean()
			.exec()
	}

	res.status(200)
		.json({
			sucesss: !!user,
			data: user && user.properties,
			timestamp: new Date()
		})
})

export default handler