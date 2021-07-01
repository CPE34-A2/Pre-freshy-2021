import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'

import Clan from '@/models/clan'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

/**
 * @method GET
 * @endpoint /api/clans/:id/properties
 * @description Get the clan's properties
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
  const clanId = req.query.id
  let clan = null

  if (!isNaN(clanId)) {
    clan = await getClanProperties(clanId)
  }

  res.status(200).json({
    sucesss: !!clan,
    data: clan,
    timestamp: new Date()
  })
})

export async function getClanProperties(id) {
	const clan = await Clan
    .findById(id)
    .select('properties owned_planet_ids')
    .lean()
    .exec()
  clan.properties.owned_planet_ids = clan.owned_planet_ids
  return clan.properties
}

export default handler
