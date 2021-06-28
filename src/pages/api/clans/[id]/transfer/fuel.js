import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'
import * as Response from '@/utils/response'

import Clan from '@/models/clan'
import Transaction from '@/models/transaction'
import User from '@/models/user'

const handler = nextConnect()

const FUEL_PRICE_PER_UNIT = 3
const FUEL_CONFIRM_REQUIRE = 3

handler
  .use(middleware)
  .use(permission)

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
  const price = amount * FUEL_PRICE_PER_UNIT

  if (isNaN(amount))
    return Response.denined(res, 'amount is not a number')

  if (amount <= 0)
    return Response.denined(res, 'amount must be greater than 0')
  
  const clan = await Clan
    .findById(req.query.id)
    .select('properties leader id')
    .exec()

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
    return Response.denined(res, 'Stop spamming. Go confirm the other one')
  }

  if ((clan.leader != req.user.id) && (user.role != 'admin')) {
    return res.status(403).json({ message: `You aren't clan leader` })
  }

  if (clan.properties.money < price)
    return Response.denined(res, 'money is not enough')

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
    confirm_require: FUEL_CONFIRM_REQUIRE + 1,
    confirmer: [req.user.id]
  })
  
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

  if (transaction.status === 'SUCCESS') {
    return Response.success(res, 'Transaction already completed')
  }

  if (transaction.confirmer.includes(req.user.id)) {
    return Response.denined(res, 'Duplicate comfirmation')
  }
  
  transaction.confirmer.push(req.user.id)
  await transaction.save()

  if (transaction.confirm_require <= transaction.confirmer.length) {
    clan.properties.money -= transaction.item.money
    clan.properties.fuel += transaction.item.fuel
    await clan.save()

    transaction.status = 'SUCCESS'
    await transaction.save()
  } 

  Response.success(res, { 
    transaction_status: transaction.status,
    clan_money: clan.properties.money,
    clan_fuel: clan.properties.fuel,
    confirm_require: transaction.confirm_require,
    confirmer: transaction.confirmer
  })  
})

export default handler