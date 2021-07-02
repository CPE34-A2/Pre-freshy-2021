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
 * @endpoint /api/users/:id/money
 * @description Get the user's money
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {	
	const userId = req.query.id
	let user = null

	if (userId.length == 11 && !isNaN(userId)) {
		user = await User
			.findById(userId)
			.select('money')
			.lean()
			.exec()
	}
	
	res.status(200)
		.json({
			sucesss: !!user,
			data: user && user.money,
			timestamp: new Date()
		})
})

export default handler