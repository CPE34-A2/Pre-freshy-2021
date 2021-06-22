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
	relation: [{
		planet_id: {
			type: Number
		},
		distance: {
			type: Number
		}
	}]
})

export default mongoose.models.Planet || mongoose.model('Planet', planetSchema)