import mongoose from 'mongoose'

const stockHistorySchema = new mongoose.Schema({
  symbol: {
    type: String
  },
  date: {
    type: String
  },
  rate: {
    type: Number
  }
}, { timestamps: true })

export default mongoose.models.StockHistory || mongoose.model('StockHistory', stockHistorySchema)