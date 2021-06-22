import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	username: {
		type: String
	},
	password: {
		type: String
	},
	display_name: {
		type: String
	},
	clan_id: {
		type: Number
	},
	properties: {
		coin: {
			type: Number,
			default: 0
		},
		stock_ids: [{
			type: mongoose.Types.ObjectId
		}]
	}
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', userSchema)
