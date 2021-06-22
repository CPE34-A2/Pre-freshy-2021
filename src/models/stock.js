import mongoose from 'mongoose'

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
  },
  amount: {
    type: Number,
  }
}, { timestamps: true })

export default mongoose.models.Stock || mongoose.model('Stock', stockSchema)
