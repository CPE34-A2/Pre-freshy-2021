import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import StockHistory from '@/models/stock-history'
import moment from 'moment'

const handler = nextConnect()

const OPEN_MARKET_TIME = { hour: 9, minute: 0, second: 0 }
const CLOSE_MARKET_TIME = { hour: 22, minute: 0, second: 0 }

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
  const openTime = moment().set(OPEN_MARKET_TIME)
  const closeTime = moment().set(CLOSE_MARKET_TIME)
  const subtract = +!(moment().isBetween(openTime, moment().endOf('day')))

  const lastStocks = await StockHistory
    .find({ date: moment().startOf('day').subtract(subtract, 'day').toDate() })
    .select('-_id symbol rate')
    .lean()
    .exec()

  const closedStocks = await StockHistory
    .find({ date: moment().startOf('day').subtract(1 + subtract, 'day').toDate() })
    .select('-_id symbol rate')
    .lean()
    .exec()

  const stocks = lastStocks.map(stock => (
    {...stock, changed: stock.rate - closedStocks.find(e => e.symbol == stock.symbol).rate }
  ))

  res.status(200)
    .json({
      sucesss: !!stocks,
      data: {
        stocks: stocks,
        is_market_opened: (moment().isBetween(openTime, closeTime))
      },
      timestamp: new Date()
    })
})

export default handler