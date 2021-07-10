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
	position: {
		type: Number,
		default: 0
	},
	fuel_rate: {
		type: Number,
		default: 3
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
		stocks: {
			// MazdaIsusuNissanToyota
			MINT: {
				type: Number,
				default: 0
			},
			// EspressoCappuccinoMoccaLatte
			ECML: {
				type: Number,
				default: 0
			},
			// HouseCondoApartment
			HCA: {
				type: Number,
				default: 0
			},
			// LuffyIchigoNarutoGoku
			LING: {
				type: Number,
				default: 0
			},
			// MangoAppleLemonPapaya
			MALP: {
				type: Number,
				default: 0
			},
		}
	},
	owned_planet_ids: [{
		type: Number,
		min: 1,
		max: 42
	}]
})

export default mongoose.models.Clan || mongoose.model('Clan', clanSchema)
