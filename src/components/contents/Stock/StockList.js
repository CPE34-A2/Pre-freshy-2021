import StockItem from '@/components/contents/Stock/StockItem'

export default function StockList({ clan, stocks: data }) {
  const { stocks, is_market_opened: isMarketOpened } = data

  return (
    <div className="flex flex-col stock-bg p-5 rounded-xl w-full scale-90 md:scale-100 max-w-sm md:max-w-md lg:max-w-lg">
      <div className="flex flex-col items-center mb-2">
        <div className="text-white font-bold text-2xl mt-2 mb-2">PORTFOLIO</div>
        <div className="flex flex-row justify-around w-full mt-2">
          {stocks.map(stock => (
            <div key={stock.symbol} className="flex flex-col text-center">
              <div className="stock-text-6">{clan.properties.stocks[stock.symbol]} {stock.symbol}</div>
              <div className="stock-text-5">{clan.properties.stocks[stock.symbol] * stock.rate} coin</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-white font-bold text-xl text-center mt-4 -mb-2">MARKET</div>
        {stocks.map(stock => (
          <StockItem
            key={stock.symbol}
            clan={clan}
            data={stock}
            open={isMarketOpened}
          />
        ))}
      </div>
    </div>
  )
}
