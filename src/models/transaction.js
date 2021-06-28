import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  owner: {
    id: {
      type: String,
      require: true
    },
    type: {
      type: String,
      require: true
    }
  },
  receiver: {
    id: {
      type: String,
      require: true
    },
    type: {
      type: String,
      require: true
    }
  },

  status: {
    type: String,
    enum: [ 'PENDING' , 'SUCCESS', 'REJECT' ],
    require: true
  },
  confirm_require: {
    type: Number,
    default: 0
  },
  confirmer: {
    type: Array
  },
  item: {
    money: {
      type: Number
    },
    fuel: {
      type: Number
    },
    stock: {
      symbol: {
        type: String
      },
      rate: {
        type: Number
      },
      amount: {
        type: Number
      }
    },
    planets: {
      type: Array
    }
  }
}, { timestamps: true })

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)