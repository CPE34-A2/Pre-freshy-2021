import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'

import Transaction from '@/models/transaction'

const handler = nextConnect()

handler
	.use(middleware)
	.use(permission)

/**
 * @method GET
 * @endpoint /api/clans/:id/transaction
 * @description Get the clan's transactions
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
	let transactions = null

	if (!isNaN(clanId) && firstIndex >= 0 && lastIndex > 0 && lastIndex - firstIndex > 0){
		transactions = await Transaction
			.find({ $or: [{ 'owner.id': clanId, 'owner.type': 'clan' }, { 'receiver.id': clanId, 'receiver.type': 'clan' }] })
			.sort({'updatedAt': -1})
			.select()
			.skip(firstIndex)
			.limit(lastIndex - firstIndex + 1)
			.lean()
			.exec()
	}

	res.status(200)
		.json({
			sucesss: !!transactions,
			data: transactions,
			timestamp: new Date()
		})
})

export default handler