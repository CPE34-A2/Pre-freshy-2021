import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'

import * as Response from '@/utils/response'
import Clan from '@/models/clan'
import Planet from '@/models/planet'
import Transaction from '@/models/transaction'
import User from '@/models/user'

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

  if (code == null) {
    return Response.denined(res, 'Please enter a code')
  }

  const clan = await Clan
    .findById(req.query.id)
    .exec()

  if (clan == null) {
    return Response.denined(res, 'mai mee clan nai database')
  }

  const user = await User
    .findById(req.user.id)
    .lean()
    .exec()

  if ((clan.leader != req.user.id) && (user.role != 'admin')) {
    return Response.denined(res, 'You arent clan leader')
  }

  const planet = await Planet
    .findOne({ redeem: code })
    .exec()

  if (!planet) {
    return Response.denined(res, 'Planet not found')
  }

  if (planet._id != clan.position) {
    return Response.denined(res, 'Planet not found')
  }

  if (planet.redeem != code) {
    return Response.denined(res, 'code is not working for this planet')
  }

  if (planet.owner == clan._id) {
    return Response.denined(res, 'You already own this planet')
  }

  if (planet.owner != 0) {
    return Response.denined(res, 'This planet has owner')
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
    },
    status: 'SUCCESS'
  })

  clan.owned_planet_ids.push(planet._id)
  clan.position = 0
  await clan.save()
  planet.owner = clan._id
  await planet.save()

  return Response.success(res, {
    clan_id: clan._id,
    planet_id: transaction.item.planets,
    redeem_code: code
  })
})

export default handler