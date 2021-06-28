import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'

import * as Response from '@/utils/response'
import Clan from '@/models/clan'
import Stock from '@/models/stock'
import Transaction from '@/models/transaction'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

const EXPECTED_REQUIRER = 3
const SYMBOL = ['MINT', 'ECML', 'HCA', 'LING', 'MALP']
const METHOD = ['BUY', 'SELL']

/**
 * @method POST
 * @endpoint /api/clans/:id/stock
 * @description Make new pending trasaction of stock trading
 * 
 * @require User authentication, the user must be a clan leadership
 * 
 * @body method
 * @body symbol
 * @body amount
 */
handler.post(async (req, res) => {
  const method = req.body.method
  const symbol = req.body.symbol
  const amount = parseInt(req.body.amount)

  if (!method || !METHOD.includes(method.toUpperCase()))
    return Response.denined(res, 'BUY or SELL only!!!')

  if (!symbol || !SYMBOL.includes(symbol.toUpperCase()))
    return Response.denined(res, 'the symbol does not exist')

  if (isNaN(amount))
    return Response.denined(res, 'amount is not a number')

  if (amount <= 0)
    return Response.denined(res, 'amount must be greater than 0')

  const stock = await Stock
    .findOne({ symbol: symbol })
    .select()
    .lean()
    .exec()

  const clan = await Clan
    .findById(req.user.clan_id)
    .select()
    .exec()

  if (clan.leader != req.user.id)
    return Response.denined(res, 'you are not leader. lol')

  if (method === 'BUY' && clan.properties.money < total)
    return Response.denined(res, 'no money, lol')

  if (method === 'SELL' && clan.properties.stocks[symbol] < amount)
    return Response.denined(res, 'get buy something, lol')

  // money as perspective
  const transaction = await Transaction.create({
    owner: {
      id: method === 'BUY' ? req.user.clan_id : '0',
      type: method === 'BUY' ? 'clan' : 'market'
    },
    receiver: {
      id: method === 'SELL' ? '0' : req.user.clan_id,
      type: method === 'SELL' ? 'market' : 'clan'
    },
    status: 'PENDING',
    confirm_require: EXPECTED_REQUIRER,
    confirmer: [req.user.id],
    item: {
      stock: {
        symbol: symbol,
        rate: stock.rate,
        amount: amount
      }
    }
  })

  Response.success(res, {
    transaction_id: transaction._id,
    transaction_status: transaction.status,
    symbol: transaction.item.stock.symbol,
    rate: transaction.item.stock.rate,
    amount: transaction.item.stock.amount
  })
})

/**
 * @method PATCH
 * @endpoint /api/clans/:id/stock
 * @description Confirm the pending transaction of stock trading 
 * 
 * @require User authentication
 * 
 * @body transaction_id
 */
handler.patch(async (req, res) => {
  const transactionId = req.body.transaction_id

  if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId))
    return Response.denined(res, 'bro... you just... sent wrong transaction')

  const transaction = await Transaction
    .findById(transactionId)
    .select()
    .exec()

  if (!transaction)
    return Response.denined(res, 'transaction not found')

  if (transaction.status === 'SUCCESS')
    return Response.success(res, 'you are too late!!! this confirmation is already SUCCESS')

  if (transaction.confirmer.includes(req.user.id))
    return Response.denined(res, 'you just already accepted it. Didn\'t you remember that?????')

  transaction.confirmer.push(req.user.id)
  await transaction.save()

  if (transaction.confirmer.length < transaction.confirm_require + 1)
    return Response.success(res, 'confirmed done!!!')

  transaction.status = 'SUCCESS'
  await transaction.save()

  const clan = await Clan
    .findById(req.user.clan_id)
    .select()
    .exec()

  const total = transaction.item.stock.rate * transaction.item.stock.amount

  if (transaction.owner.type === 'clan') {
    if (clan.properties.money < total) {
      return Response.denined(res, 'no money, lol')
    }
    clan.properties.money -= total
    clan.properties.stocks[transaction.item.stock.symbol] += transaction.item.stock.amount
    await clan.save()

  } else if (transaction.owner.type === 'market') {
    if (clan.properties.stocks[transaction.item.stock.symbol] < transaction.item.stock.amount) {
      return Response.denined(res, 'get buy something, lol')
    }
    clan.properties.money += total
    clan.properties.stocks[transaction.item.stock.symbol] -= transaction.item.stock.amount
    await clan.save()
  }

  Response.success(res, {
    transaction_id: transaction._id,
    transaction_status: transaction.status,
    symbol: transaction.item.stock.symbol,
    rate: transaction.item.stock.rate,
    amount: transaction.item.stock.amount,
    current_money: clan.properties.money,
  })
})

export default handler