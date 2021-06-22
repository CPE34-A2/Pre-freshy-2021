import mongoose from 'mongoose'

const clanSchema = new mongoose.Schema({
	_id: {
		type: Number,
	},
	name: {
		type: String,
	},
	members: {
		leader_id: {
			type: Number
		},
		crew_ids: [{
			type: Number
		}]
	},
	properties: {
		coin: {
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
