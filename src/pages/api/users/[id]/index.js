import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/user'

import { getUserData } from '@/services/user'

const handler = nextConnect()

handler
	.use(middleware)
	.use(permission)

/**
 * @method GET
 * @endpoint /api/users/:id
 * @description Get the user's data
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	const userId = req.query.id
	let user = null

	if (userId.length == 11 && !isNaN(userId)) {
		user = await getUserData(userId)
	}
	
	res.status(200)
		.json({
			sucesss: !!user,
			data: user,
			timestamp: new Date()
		})
})

export default handler