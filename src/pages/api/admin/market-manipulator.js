import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/admin'

import * as Response from '@/utils/response'
import Stock from '@/models/stock'
import StockHistory from '@/models/stock-history'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

const SYMBOL = ['MINT', 'ECML', 'HCA', 'LING', 'MALP']

/**
 * @method POST
 * @endpoint /api/admin/market-manipulator
 * @description Deus ex machina of the market; That true god who manipulate them all.
 * 
 * @require Admin authentication
 * 
 * @body symbol
 * @body rate
 * @body date
 */
handler.post(async (req, res) => {
  const symbol = req.body.symbol
  const rate = parseInt(req.body.rate)
  const date = req.body.date

  if (!symbol || !SYMBOL.includes(symbol.toUpperCase()))
    return Response.denined(res, 'the symbol does not exist')

  if (isNaN(rate))
    return Response.denined(res, 'rate is not a number')

  if (rate < 0)
    return Response.denined(res, 'amount must be a positive integer')

  if (!new Date(date).getTime())
    return Response.denined(res, 'date is not valid')

  const stockHistory = await StockHistory
    .findOne({ symbol: symbol, date: date })
    .select()
    .exec()

  if (stockHistory) {
    stockHistory.rate = rate
    stockHistory.save()
  } else {
    var newStockHistory = await StockHistory.create({
      symbol: symbol,
      date: date,
      rate: rate
    })
  }

  if (date === (new Date()).toLocaleDateString()) {
    const stock = await Stock
      .findOne({'symbol': symbol})
      .select()
      .exec()

    stock.rate = rate
    stock.save()
  }

  Response.success(res, {
    type: stockHistory ? 'update' : 'create',
    data: stockHistory ? stockHistory : newStockHistory})
})

export default handler