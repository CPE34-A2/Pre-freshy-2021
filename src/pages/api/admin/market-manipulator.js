import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/admin'

import * as Response from '@/utils/response'
import Clan from '@/models/clan'
import StockHistory from '@/models/stock-history'

import moment from 'moment-timezone'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

const SYMBOL = ['MINT', 'ECML', 'HCA', 'LING', 'MALP']

/**
 * @method GET
 * @endpoint /api/admin/market-manipulator
 * @description Deus ex machina of the market; That true god who manipulate them all.
 * 
 * @require Admin authentication
 * 
 * @param symbol
 * @param rate
 * @param date
 */
handler.get(async (req, res) => {
  let symbol = req.query.symbol
  const rate = parseInt(req.query.rate)
  const date = moment.tz((req.query.date), "DD/MM/YYYY",  "Asia/Bangkok").utcOffset('+0700').valueOf()

  if (symbol)
    symbol = symbol.toUpperCase()

  if (!symbol || !SYMBOL.includes(symbol))
    return Response.denined(res, 'the symbol does not exist')

  if (isNaN(rate))
    return Response.denined(res, 'rate is not a number')

  if (rate < 0)
    return Response.denined(res, 'amount must be a positive integer')

  if (!new Date(date).getTime())
    return Response.denined(res, 'date is not valid')

  const stockHistory = await StockHistory
    .findOne({ symbol: symbol, date: new Date(date) })
    .select()
    .exec()

  if (stockHistory) {
    stockHistory.rate = rate
    stockHistory.save()
  } else {
    var newStockHistory = await StockHistory.create({
      symbol: symbol,
      date: new Date(date),
      rate: rate
    })
  }

  Response.success(res, {
    type: stockHistory ? 'update' : 'create',
    data: stockHistory ? stockHistory : newStockHistory
  })
})

/**
 * @method PATCH
 * @endpoint /api/admin/market-manipulator
 * @description add or remove the clan's stocks
 * @description positive amount to add/ negative amount to remove
 * @require Admin authentication
 * 
 * @body clan_id
 * @body symbol
 * @body amount
 */
handler.patch(async (req, res) => {
  const clanId = parseInt(req.body.clan_id) || 0
  let symbol = req.body.symbol
  const amount = parseInt(req.body.amount)

  if (symbol)
    symbol = symbol.toUpperCase()

  if (!symbol || !SYMBOL.includes(symbol.toUpperCase()))
    return Response.denined(res, 'symbol not found!!!')

  const clan = await Clan
    .findById(clanId)
    .select('properties')
    .exec()

  if (!clan)
    return Response.denined(res, 'clan not found!!!')

  if (isNaN(amount))
    return Response.denined(res, 'amount is not number!!!')

  if (clan.properties.stocks[symbol] + amount < 0)
    return Response.denined(res, 'Bro... We are not having SHORT or LONG things')

  clan.properties.stocks[symbol] += amount
  await clan.save()

  Response.success(res, {
    clan_id: clanId,
    symbol: symbol,
    change: amount > 0 ? 'add amount: ' + amount : 'remove amount: ' + (-amount)
  })
})

export default handler