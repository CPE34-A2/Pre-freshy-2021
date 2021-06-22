import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

})

export default mongoose.models.User || mongoose.model('User', userSchema)