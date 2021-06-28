import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/user'

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
    clan = await Clan
      .findById(clanId)
      .select('properties')
      .lean()
      .exec()
  }

  res.status(200).json({
    sucesss: !!clan,
    data: clan ? clan.properties : clan,
    timestamp: new Date()
  })
})

export default handler
