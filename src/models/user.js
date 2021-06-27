import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	// _id is username for logging in, e.g. 63070501002
	_id: {
		type: String
	},
	display_name: {
		type: String
	},
	password: {
		type: String
	},
	role: {
		type: String,
		default: 'user',
		enum: ['user', 'admin']
	},
	clan_id: {
		type: Number
	},
	properties: {
		money: {
			type: Number,
			default: 0
		}
	},
}, { timestamps: true })

userSchema.methods.isAdmin = function() {
	return this.role === 'admin'
}

export default mongoose.models.User || mongoose.model('User', userSchema)
