import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'

import Battle from '@/models/battle'

const handler = nextConnect()

handler
	.use(middleware)
	.use(permission)

const STATUS = ['PENDING', 'WIN', 'LOSE', 'REJECT', 'DENIED']

/**
 * @method GET
 * @endpoint /api/clans/:id/battle
 * @description Get the clan's battles
 * 
 * @param firstIndex
 * @param lastIndex
 * @param status (*optional)
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	const clanId = req.query.id
	const firstIndex = parseInt(req.query.firstIndex) || 0
	const lastIndex = parseInt(req.query.lastIndex) || 0

	let status = req.query.status
	status = status && status.toUpperCase()

	let battles = null

	if (STATUS.includes(status)) {
		const isNormalStatus = !['WIN', 'LOSE'].includes(status) 
		battles = Battle
			.find({
				$or: [
					{ attacker: clanId, status: isNormalStatus ? status : (status == 'WIN' ? 'ATTACKER_WON' : 'DEFENDER_WON') },
					{ defender: clanId, status: isNormalStatus ? status : (status == 'WIN' ? 'DEFENDER_WON' : 'ATTACKER_WON') }
				]
			})
	} else {
		battles = Battle
			.find({ $or: [{ attacker: clanId }, { defender: clanId }] })
	}

	battles = await battles
		.sort({ 'updatedAt': -1 })
		.select()
		.skip(firstIndex)
		.limit(lastIndex - firstIndex + 1)
		.lean()
		.exec()

	res.status(battles ? 200 : 400)
		.json({
			sucesss: !!battles,
			data: battles,
			timestamp: new Date()
		})
})

export default handler