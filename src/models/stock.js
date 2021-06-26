import mongoose from 'mongoose'

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String
  },
  rate: {
    type: Number
  },
}, { timestamps: true })

export default mongoose.models.Stock || mongoose.model('Stock', stockSchema)