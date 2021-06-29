import mongoose from 'mongoose'

const stockHistorySchema = new mongoose.Schema({
  symbol: {
    type: String
  },
  date: {
    type: Date,
  },
  rate: {
    type: Number
  }
}, { timestamps: true })

export default mongoose.models.StockHistory || mongoose.model('StockHistory', stockHistorySchema)