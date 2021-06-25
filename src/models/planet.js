import mongoose from 'mongoose'

const planetSchema = new mongoose.Schema({
	_id: {
		type: Number
	},
	name: {
		type: String
	},
	point: {
		type: Number
	},
	characteristic_ids: [{
		type: Number
	}],
	tier: {
		type: Number
	}
})

export default mongoose.models.Planet || mongoose.model('Planet', planetSchema)