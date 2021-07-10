import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'

import Battle from '@/models/battle'

const handler = nextConnect()

handler
	.use(middleware)
	.use(permission)

/**
 * @method GET
 * @endpoint /api/clans/:id/battle
 * @description Get the clan's battles
 * 
 * @param firstIndex
 * @param lastIndex
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	const clanId = req.query.id
	const firstIndex = parseInt(req.query.firstIndex) || 0
	const lastIndex = parseInt(req.query.lastIndex) || 0
	let battles = null

	if (!isNaN(clanId) && firstIndex >= 0 && lastIndex > 0 && lastIndex - firstIndex > 0){
		battles = await Battle
			.find({ $or: [{ attacker: clanId }, { defender: clanId }] })
			.sort({'updatedAt': -1})
			.select()
			.skip(firstIndex)
			.limit(lastIndex - firstIndex + 1)
			.lean()
			.exec()
	}

	res.status(battles ? 200 : 400)
		.json({
			sucesss: !!battles,
			data: battles,
			timestamp: new Date()
		})
})

export default handler