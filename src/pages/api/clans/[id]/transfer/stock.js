import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'

import * as Response from '@/utils/response'
import Clan from '@/models/clan'
import Stock from '@/models/stock'
import Transaction from '@/models/transaction'

import moment from 'moment-timezone'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

const EXPECTED_REQUIRER = 3
const SYMBOL = ['MINT', 'ECML', 'HCA', 'LING', 'MALP']
const METHOD = ['BUY', 'SELL']
const OPEN_MARKET_TIME = 9
const CLOSE_MARKET_TIME = 22

/**
 * @method GET
 * @endpoint /api/clans/:id/transfer/stock
 * @description Get the pending stock trasaction
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
  const clanId = parseInt(req.query.id)
  let transaction = null

  if (!isNaN(clanId)) {
    transaction = await Transaction
      .findOne({
        $or: [
          { 'owner.id': req.query.id, 'receiver.type': 'market', 'status': 'PENDING' },
          { 'receiver.id': req.query.id, 'owner.type': 'market', 'status': 'PENDING' }
        ]
      })
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
  let method = req.body.method
  let symbol = req.body.symbol
  const amount = parseInt(req.body.amount)
  const currentTime = moment().utcOffset('+0700').hour()

  if (currentTime < OPEN_MARKET_TIME || currentTime > CLOSE_MARKET_TIME) {
    return Response.denined(res, 'market closed!!!')
  }

  if ((!method) || (!symbol)) {
    return Response.denined(res, 'method or symbol not defined')
  }

  symbol = symbol.toUpperCase()
  method = method.toUpperCase()

  if (!method || !METHOD.includes(method))
    return Response.denined(res, 'BUY or SELL only!!!')

  if (!symbol || !SYMBOL.includes(symbol))
    return Response.denined(res, 'the symbol does not exist')

  if (isNaN(amount))
    return Response.denined(res, 'amount is not a number')

  if (amount <= 0)
    return Response.denined(res, 'amount must be greater than 0')

  const pendingTransaction = await Transaction.findOne({ $or: [{ 'owner.id': req.query.id, 'receiver.type': 'market' }, { 'receiver.id': req.query.id, 'owner.type': 'market' }] }, { 'status': 'PENDING' })
    .select('_id')
    .lean()
    .exec()

  if (pendingTransaction)
    return Response.denined(res, 'There are still pending transaction')

  const stock = await Stock
    .findOne({ symbol: symbol })
    .select()
    .lean()
    .exec()

  const total = stock.rate * amount

  const clan = await Clan
    .findById(req.user.clan_id)
    .select()
    .exec()

  if (!clan)
    return Response.denined(res, 'clan not found')

  if (clan.leader != req.user.id)
    return Response.denined(res, 'you are not leader. lol')

  if (method === 'BUY' && clan.properties.money < total)
    return Response.denined(res, 'no money, lol')

  if (method === 'SELL' && clan.properties.stocks[symbol] < amount)
    return Response.denined(res, 'not enough stock, lol')

  // money as perspective
  const newTransaction = await Transaction.create({
    owner: {
      id: method === 'BUY' ? req.user.clan_id : '0',
      type: method === 'BUY' ? 'clan' : 'market'
    },
    receiver: {
      id: method === 'SELL' ? req.user.clan_id : '0',
      type: method === 'SELL' ? 'clan' : 'market'
    },
    status: 'PENDING',
    confirm_require: EXPECTED_REQUIRER,
    confirmer: [req.user.id],
    rejector: [],
    item: {
      stock: {
        symbol: symbol,
        rate: stock.rate,
        amount: amount
      }
    }
  })

  Response.success(res, newTransaction)
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

  if (transaction.owner.id != req.user.clan_id && transaction.receiver.id != req.user.clan_id)
    return Response.denined(res, 'This transaction is belong to other clan. What do you want???')

  if (!transaction)
    return Response.denined(res, 'transaction not found')

  if (transaction.status === 'SUCCESS')
    return Response.denined(res, 'you are too late!!! this confirmation is already SUCCESS')

  if (transaction.status === 'REJECT')
    return Response.denined(res, 'you are too late!!! this confirmation is already REJECT')

  if (transaction.confirmer.includes(req.user.id))
    return Response.denined(res, 'You already accepted')

  if (transaction.rejector.includes(req.user.id))
    return Response.denined(res, `You already rejected`)

  const stock = await Stock
    .findOne({ 'symbol': transaction.itme.stock.symbol })
    .select('rate')
    .lean()
    .exec()

  if (stock.rate != transaction.item.stock.rate) {
    transaction.status = 'REJECT'
    await transaction.save()
    return Response.denined(res, `The price has been changed`)
  }
  transaction.confirmer.push(req.user.id)
  await transaction.save()

  // If the number of confirmer equal expected required, then excute the transaction
  if (transaction.confirm_require + 1 <= transaction.confirmer.length) {
    const clan = await Clan
      .findById(req.user.clan_id)
      .select()
      .exec()

    const total = transaction.item.stock.rate * transaction.item.stock.amount

    if (transaction.owner.type === 'clan') {
      if (clan.properties.money < total) {
        transaction.status = 'REJECT'
        await transaction.save()
        return Response.denined(res, 'no money, lol')
      }
      clan.properties.money -= total
      clan.properties.stocks[transaction.item.stock.symbol] += transaction.item.stock.amount
      await clan.save()

    } else if (transaction.owner.type === 'market') {
      if (clan.properties.stocks[transaction.item.stock.symbol] < transaction.item.stock.amount) {
        transaction.status = 'REJECT'
        await transaction.save()
        return Response.denined(res, 'not enough stock, lol')
      }
      clan.properties.money += total
      clan.properties.stocks[transaction.item.stock.symbol] -= transaction.item.stock.amount
      await clan.save()
    }

    transaction.status = 'SUCCESS'
    await transaction.save()
  }

  req.socket.server.io.emit('set.task.stock', req.user.clan_id,
    transaction.status == 'PENDING' ? transaction : null
  )

  req.socket.server.io.emit('set.clan.money', req.user.clan_id, clan.properties.money)
  req.socket.server.io.emit('set.clan.stock', req.user.clan_id, clan.properties.stocks)

  Response.success(res, transaction)
})

/**
 * @method DELETE
 * @endpoint /api/clans/:id/stock
 * @description Reject the pending transaction of stock trading 
 * 
 * @require User authentication
 * 
 * @body transaction_id
 */
handler.delete(async (req, res) => {
  const transactionId = req.body.transaction_id

  if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId))
    return Response.denined(res, 'bro... you just... sent wrong transaction')

  const transaction = await Transaction
    .findById(transactionId)
    .select()
    .exec()

  if (transaction.owner.id != req.user.clan_id && transaction.receiver.id != req.user.clan_id)
    return Response.denined(res, 'This transaction is belong to other clan. What do you want???')

  if (!transaction)
    return Response.denined(res, 'transaction not found')

  if (transaction.status === 'SUCCESS')
    return Response.denined(res, 'you are too late!!! this confirmation is already SUCCESS')

  if (transaction.status === 'REJECT')
    return Response.denined(res, 'you are too late!!! this confirmation is already REJECT')

  const clan = await Clan
    .findById(req.user.clan_id)
    .select('properties leader')
    .exec()

  if (transaction.confirmer.includes(req.user.id) && (req.user.id != clan.leader))
    return Response.denined(res, `You already accepted`)

  if (transaction.rejector.includes(req.user.id))
    return Response.denined(res, `You already rejected`)

  transaction.rejector.push(req.user.id)

  if ((transaction.confirm_require <= transaction.rejector.length) || (req.user.id == clan.leader)) {
    transaction.status = 'REJECT'
  }

  await transaction.save()

  req.socket.server.io.emit('set.task.stock', req.user.clan_id,
    transaction.status == 'PENDING' ? transaction : null
  )

  Response.success(res, transaction)
})

export default handler