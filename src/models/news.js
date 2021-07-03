import mongoose from 'mongoose'

const newsSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  english_content: {
    type: String
  },
  category: {
    type: String,
    enum: ['DAILY', 'DISASTER', 'CHECKING'],
    require: true
  },
  affect: {
    type: String,
    enum: ['COIN', 'FUEL', 'PLANET', 'NONE'],
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