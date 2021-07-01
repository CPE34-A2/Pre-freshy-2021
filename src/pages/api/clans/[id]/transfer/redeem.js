import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'

import * as Response from '@/utils/response'
import Clan from '@/models/clan'
import Planet from '@/models/planet'
import Transaction from '@/models/transaction'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

/**
 * @method post
 * @endpoint /api/clans/:id/transfer/redeem
 * @description Get rewards form code
 * 
 * @body code
 * 
 * @require User authentication
 */
handler.post(async (req, res) => {
  const code = req.body.code

  const clan = await Clan
    .findById(req.query.id)
    .exec()

  if ((clan.leader != req.user.id) && (user.role != 'admin')) {
    return Response.denined(res, 'You arent clan leader')
  }

  const planet = await Planet
    .findOne({ redeem: code })
    .exec()

  if (code == null) {
    return Response.denined(res, 'Please enter a code')
  }

  if (planet.owner != null) {
    return Response.denined(res, 'This planet has owner')
  }

  if (planet._id != clan.position) {
    return Response.denined(res, 'This planet is not in your position ')
  }

  if (planet.redeem != code) {
    return Response.denined(res, 'code is not working for this planet')
  }

  const transaction = await Transaction.create({
    owner: {
      id: clan._id,
      type: 'clan'
    },
    receiver: {
      id: planet._id,
      type: 'planet'
    },
    item: {
      planets: [planet.id]
    }
  })

  clan.owner_planet_id.push(planet._id)
  await clan.save()
  planet.owner = clan._id
  await clan.save()
  return Response.success(res, {
    clan_id: clan._id,
    planet_id: transaction.item.planets,
    redeem_code: code
  })
})