import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'
import Stock from '@/models/stock'
import StockHistory from '@/models/stock-history'

import * as Response from '@/utils/response'
import moment from 'moment-timezone'

const handler = nextConnect()

const OPEN_MARKET_TIME = 9
const CLOSE_MARKET_TIME = 22

let IS_FIRSTTIME_FETCH = true

handler
  .use(middleware)

/**
 * @method GET
 * @endpoint /api/stock
 * @description Get current price of stocks
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
  let stocks = null

  const currentTime = moment().utcOffset('+0700')

  stocks = await Stock
    .find()
    .select('symbol rate')
    .exec()

  if (currentTime.hour() < OPEN_MARKET_TIME || currentTime.hour() >= CLOSE_MARKET_TIME) {
    IS_FIRSTTIME_FETCH = true
    return res.status(200)
    .json({
      sucesss: !!stocks,
      data: {stocks: stocks, is_market_opened: false},
      timestamp: new Date()
    })
  }

  const yesterdayStockHistory = await StockHistory
    .find({ date: new Date(currentTime.startOf('day').valueOf() - 86400000) })
    .select('symbol rate')
    .exec()

  if (IS_FIRSTTIME_FETCH) {
    IS_FIRSTTIME_FETCH = false
    let todayStockPrice = await StockHistory
      .find({ date: new Date(currentTime.startOf('day').valueOf()) })
      .select()
      .exec()

    if (todayStockPrice) {
      todayStockPrice.forEach((e) => {
        stocks.forEach((f) => {
          if (f.symbol === e.symbol) {
            f.rate = e.rate
            f.save()
          }
        })
      })
    }
  }

  const data = stocks.map(v => ({ ...v._doc, changed: v.rate - yesterdayStockHistory.find(f => f.symbol == v.symbol).rate }))

  res.status(200)
    .json({
      sucesss: !!data,
      data: {stocks: data, is_market_closed: true},
      timestamp: new Date()
    })
})

export default handler