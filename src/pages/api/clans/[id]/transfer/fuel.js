import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'
import * as Response from '@/utils/response'

import Clan from '@/models/clan'
import Transaction from '@/models/transaction'
import User from '@/models/user'

const handler = nextConnect()

const FUEL_CONFIRM_REQUIRE = 3

handler
  .use(middleware)
  .use(permission)

/**
* @method GET
* @endpoint /api/clans/:id/transfer/fuel
* @description Get the pending fuel trasaction
* 
* @require User authentication
*/
handler.get(async (req, res) => {
  const clanId = parseInt(req.query.id)
  let transaction = null

  if (!isNaN(clanId)) {
    transaction = await Transaction
      .findOne({ 'owner.id': req.user.clan_id, 'receiver.id': req.user.clan_id, 'owner.type': 'clan', 'receiver.type': 'clan', 'status': 'PENDING' })
      .select()
      .lean()
      .exec()
  }

  res
    .status(transaction ? 200 : 400)
    .json({
      sucesss: !!transaction,
      data: transaction,
      timestamp: new Date()
    })
})

/**
 * @method Post
 * @endpoint /api/clans/:id/transfer/fuel
 * @description create fuel transaction
 * 
 * @body amount
 * 
 * @require User authentication / Clan leadership
 */
handler.post(async (req, res) => {
  const amount = parseInt(req.body.amount)

  if (isNaN(amount))
    return Response.denined(res, 'amount is not a number')

  if (amount <= 0)
    return Response.denined(res, 'amount must be greater than 0')

  const clan = await Clan
    .findById(req.query.id)
    .select('properties leader _id fuel_rate')
    .exec()

  if (!clan)
    return Response.denined(res, 'clan not found')

  const price = amount * clan.fuel_rate

  const user = await User
    .findById(req.user.id)
    .select('role')
    .exec()

  const dupeTransaction = await Transaction
    .findOne({
      "owner.id": clan.id,
      "receiver.id": clan.id,
      status: 'PENDING'
    })

  if (dupeTransaction) {
    return Response.denined(res, `There're still pending transaction`)
  }

  if ((clan.leader != req.user.id) && (user.role != 'admin')) {
    return res.status(403).json({ message: `You aren't clan leader` })
  }

  if (clan.properties.money < price)
    return Response.denined(res, 'Money is not enough')

  const transaction = await Transaction.create({
    owner: {
      id: clan._id,
      type: 'clan'
    },
    receiver: {
      id: clan._id,
      type: 'clan'
    },
    status: 'PENDING',
    item: {
      money: price,
      fuel: amount
    },
    confirm_require: FUEL_CONFIRM_REQUIRE,
    confirmer: [req.user.id],
    rejector: []
  })

  req.socket.server.io.emit('set.task.fuel', req.user.clan_id, transaction)

  Response.success(res, {
    transaction_id: transaction._id,
    transaction_status: transaction.status,
    confirm_require: transaction.confirm_require,
    confirmer: transaction.confirmer,
    clan_money: clan.properties.money,
    clan_fuel: clan.properties.fuel,
  })
})

/**
 * @method Patch
 * @endpoint /api/clans/:id/transfer/fuel
 * @description confirm fuel transaction
 * 
 * @body transaction_id
 * 
 * @require User authentication / Clan membership
 */
handler.patch(async (req, res) => {

  const clan = await Clan
    .findById(req.query.id)
    .select('properties')
    .exec()

  if (!mongoose.Types.ObjectId.isValid(req.body.transaction_id)) {
    return Response.denined(res, 'Invalid transaction id')
  }

  const transaction = await Transaction
    .findById(req.body.transaction_id)
    .exec()

  if (!transaction) {
    return Response.denined(res, 'Transaction not found')
  }

  if (transaction.owner.id != req.user.clan_id) {
    return Response.denined(res, 'You are not own this transaction')
  }

  if (transaction.status === 'SUCCESS') {
    return Response.denined(res, 'Transaction already successed')
  }

  if (transaction.status === 'REJECT') {
    return Response.denined(res, 'Transaction already rejected')
  }

  if (transaction.rejector.includes(req.user.id)) {
    return Response.denined(res, 'You already rejected')
  }

  if (transaction.confirmer.includes(req.user.id)) {
    return Response.denined(res, 'You already accepted')
  }

  transaction.confirmer.push(req.user.id)

  if (transaction.confirm_require + 1 <= transaction.confirmer.length) {
    if (clan.properties.money < transaction.item.money) {
      transaction.status = 'REJECT'
      await transaction.save()
      return Response.denined(res, 'money is not enough. Transaction closed')
    }

    clan.properties.money -= transaction.item.money
    clan.properties.fuel += transaction.item.fuel
    await clan.save()

    req.socket.server.io.emit('set.clan.money', req.user.clan_id, clan.properties.money)
    req.socket.server.io.emit('set.clan.fuel', req.user.clan_id, clan.properties.fuel)

    transaction.status = 'SUCCESS'
  }

  await transaction.save()

  req.socket.server.io.emit('set.task.fuel', req.user.clan_id,
    transaction.status == 'PENDING' ? transaction : null
  )

  Response.success(res, {
    transaction_status: transaction.status,
    clan_money: clan.properties.money,
    clan_fuel: clan.properties.fuel,
    confirm_require: transaction.confirm_require,
    confirmer: transaction.confirmer,
    rejector: transaction.rejector
  })
})

/**
 * @method Delete
 * @endpoint /api/clans/:id/transfer/fuel
 * @description reject fuel transaction
 * 
 * @body transaction_id
 * 
 * @require User authentication / Clan membership
 */
handler.delete(async (req, res) => {
  const clan = await Clan
    .findById(req.query.id)
    .select('properties leader')
    .exec()

  if (!mongoose.Types.ObjectId.isValid(req.body.transaction_id)) {
    return Response.denined(res, 'Invalid transaction id')
  }

  const transaction = await Transaction
    .findById(req.body.transaction_id)
    .exec()

  if (!transaction) {
    return Response.denined(res, 'Transaction not found')
  }

  if (transaction.owner.id != req.user.clan_id) {
    return Response.denined(res, 'You are not own this transaction')
  }

  if (transaction.status === 'SUCCESS') {
    return Response.denined(res, 'Transaction already successed')
  }

  if (transaction.status === 'REJECT') {
    return Response.denined(res, 'Transaction already rejected')
  }

  if (transaction.confirmer.includes(req.user.id) && (req.user.id != clan.leader)) {
    return Response.denined(res, 'You already accepted')
  }

  if (transaction.rejector.includes(req.user.id)) {
    return Response.denined(res, 'You already rejected')
  }

  transaction.rejector.push(req.user.id)

  if ((transaction.confirm_require <= transaction.rejector.length) || (req.user.id == clan.leader)) {
    transaction.status = 'REJECT'
  }

  await transaction.save()

  req.socket.server.io.emit('set.task.fuel', req.user.clan_id,
    transaction.status == 'PENDING' ? transaction : null
  )

  Response.success(res, {
    transaction_status: transaction.status,
    clan_money: clan.properties.money,
    clan_fuel: clan.properties.fuel,
    confirm_require: transaction.confirm_require,
    confirmer: transaction.confirmer,
    rejector: transaction.rejector
  })
})

export default handler