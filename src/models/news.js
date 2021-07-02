import mongoose from 'mongoose'

const newsSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  category: {
    type: String,
    enum: ['NORMAL', 'STOCK', 'DISASTER', 'CHECKING',],
    require: true
  },
  author: {
    type: String
  },
  deleter: {
    type: String
  }
}, { timestamps: true })

export default mongoose.models.News || mongoose.model('News', newsSchema)