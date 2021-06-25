import mongoose from 'mongoose'

const clanSchema = new mongoose.Schema({
	_id: {
		type: Number,
	},
	name: {
		type: String,
	},
	leader: {
		type: String
	},
	members: [{
		type: String
	}],
	properties: {
		money: {
			type: Number,
			default: 0
		},
		fuel: {
			type: Number,
			default: 0
		},
	},
	owned_planet_ids: [{
		type: Number,
		min: 1,
		max: 35
	}]
})

export default mongoose.models.Clan || mongoose.model('Clan', clanSchema)
