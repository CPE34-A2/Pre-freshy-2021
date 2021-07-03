import mongoose from 'mongoose'

const battleSchema = new mongoose.Schema({
  current_phase: {
    type: Number
  },
  attacker: {
    type: Number
  },
  defender: {
    type: Number
  },
  stakes: {
    money: {
      type: Number
    },
    fuel: {
      type: Number
    },
    planet_ids: {
      type: Array
    }
  },
  target_planet_id: {
    type: Number
  },
  game: {
    type: String
  },
  confirm_require: {
    type: Number
  },
  phase01: {
    confirmer: {
      type: Array
    },
    rejector: {
      type: Array
    },
    status: {
      type: String,
      enum: [ 'PENDING' , 'SUCCESS', 'REJECT' ],
      require: true
    }
  },
  phase02: {
    confirmer: { 
      type: Array
    },
    rejector: {
      type: Array
    },
    status: {
      type: String,
      enum: [ 'PENDING' , 'SUCCESS', 'REJECT']
    }
  },
  phase03: {
    confirmer: {
      type: String
    },
    status: {
      type: String,
      enum: [ 'PENDING' , 'SUCCESS' ],
      require: true
    }
  },
  phase04: {
    attacker_vote_win: {
      type: Array
    },
    attacker_vote_lose: {
      type: Array
    },
    defender_vote_win: {
      type: Array
    },
    defender_vote_lose: {
      type: Array
    },
    status: {
      type: String,
      enum: [ 'PENDING', 'SUCCESS', 'SUS' ],
      require: true
    }
  },
  status: {
    type: String,
    enum: [ 'PENDING', 'SUS' , 'ATTACKER_WON', 'DEFENDER_WON', 'REJECT', 'DENIED' ],
    require: true 
  }
})

export default mongoose.models.Battle || mongoose.model('Battle', battleSchema)
