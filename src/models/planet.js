import mongoose from 'mongoose'

const planetSchema = new mongoose.Schema({
	_id: {
		type: Number
	},
	name: {
		type: String
	},
	tier: {
		type: String
	},
	point: {
		type: Number
	},
	travel_cost: {
		type: Number
	},
	owner: {
		type: Number
	},
	redeem: {
    type: String
  },
	quest: {
		type: String
	}
})

export default mongoose.models.Planet || mongoose.model('Planet', planetSchema)