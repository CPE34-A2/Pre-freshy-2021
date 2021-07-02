import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Planet from '@/models/planet'
import Clan from '@/models/clan'

const handler = nextConnect()

handler
	.use(middleware)

/**
 * @method GET
 * @endpoint /api/planets/:id/quest
 * @description Get the clan's data
 * 
 * @require User authentication/ clan position at the planet
 */
handler.get(async (req, res) => {
	const planetId = req.query.id
  const clanId = req.user.clan_id

  const clan = await Clan
    .findById(clanId)
    .select('position')
    .lean()
    .exec()

  if (!clan) {
    return res
    .status(400)
    .json({
      status: false,
      message: 'Somehow. You dont belong to any clan',
      timestamp: new Date()
    })
  }
  
	let planet = null

	if (!isNaN(planetId)) {
    if (clan.position != planetId) {
      return res
        .status(400)
        .json({
          status: false,
          message: 'You are not in the correct position',
          timestamp: new Date()
        })
    }

		planet = await Planet
			.findById(planetId)
      .select('quest')
			.lean()
			.exec()
	}
	
	res.status(200)
		.json({
			sucesss: !!planet,
			data: planet,
			timestamp: new Date()
		})
})

export default handler