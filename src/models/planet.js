import mongoose from 'mongoose'

const planetSchema = new mongoose.Schema({
	_id: {
		type: Number
	},
	name: {
		type: String
	},
	tier: {
		type: Number
	},
	point: {
		type: Number
	},
	travel_exprense: {
		type: Number
	},
	owner: {
		type: Number
	}
})

export default mongoose.models.Planet || mongoose.model('Planet', planetSchema)