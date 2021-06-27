import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import credentials from '@/middlewares/credentials'

import Clan from '@/models/clan'

const handler = nextConnect()

handler
	.use(middleware)
	.use(credentials)

/**
 * @method GET
 * @endpoint /api/clans
 * @description Get all clans' data only admin role
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	let clans = null
	const role = User
		.findById(req.user.id)		
		.select('role')
		.lean()
		.exec()

	if (role == 'admin') {
		clans = await Clan
			.find()
			.lean()
			.exec()
	}

	res.status(200)
		.json({
			sucesss: !!clans,
			data: clans,
			timestamp: new Date()
		})
})

export default handler