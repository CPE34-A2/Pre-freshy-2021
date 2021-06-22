import mongoose from 'mongoose'

const clanSchema = new mongoose.Schema({

})

export default mongoose.models.Clan || mongoose.model('Clan', clanSchema)