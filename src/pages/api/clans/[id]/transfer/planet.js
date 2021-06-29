import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'
import * as Response from '@/utils/response'

import Planet from '@/models/planet'
import Clan from '@/models/clan'
import Transaction from '@/models/transaction'
import User from '@/models/user'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

/**
 * @method post
 * @endpoint /api/clans/:id/transfer/planet
 * @description Get owner on planet (need summit)
 * 
 * @body targetPlanet
 * 
 * @require User authentication
 */
handler.post(async (req, res) => {
  const targetPlanet = req.body.targetPlanet

  if (isNaN(targetPlanet) || targetPlanet < 0) {
    return Response.denined(res, 'targetPlanet is not number or under 0')
  }

  const clan = await Clan
    .findById(req.query.id)
    .exec()

  const user = await User
    .findById(req.user.id)
    .lean()
    .exec()

  if ((clan.leader != req.user.id) && (user.role != 'admin')) {
    return res.status(403).json({ message: 'You arent clan leader' })
  }

  const planet = await Planet
    .findOne({ _id: targetPlanet })
    .select('_id travel_cost owner')
    .exec()

  if (planet.owner != null) {
    if (planet.owner == clan._id)
      return Response.denined(res, 'This is your planet')
    else
      return Response.denined(res, 'This planet has owner')
  }

  if (clan.properties.fuel < planet.travel_cost) {
    return Response.denined(res, 'you dont have enough fuel')
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
    status: 'SUCCESS',
    confirm_require: 3,
    confirmer: [req.user.id],
    item: {
      fuel: planet.travel_cost,
      planets: [targetPlanet]
    }
  })

  Response.success(res, {
    confirm_require: transaction.confirmer.length
  })
})

/**
 * @method patch
 * @endpoint /api/clans/:id/transfer/planet
 * @description submmit to confirm
 * 
 * @body transactionid
 * 
 * @require User authentication
 */
handler.patch(async (req, res) => {
  let transactionid = req.body.transactionid

  let transaction = await Transaction
    .findById(transactionid)
    .exec()

  let clan = await Clan
    .findById(req.query.id)
    .exec()

  const planet = await Planet
    .findOne({ _id: transaction.item.planets })
    .select('_id travel_cost owner')
    .exec()

  if (!transaction.confirmer.includes(req.user.id)) {
    transaction.confirmer.push(req.user.id)

    if (transaction.confirmer.length == transaction.confirm_require + 1) {
      clan.properties.fuel -= planet.travel_cost
      clan.owned_planet_ids = [...clan.owned_planet_ids, ...transaction.item.planets]
      await clan.save()
      planet.owner = clan.id
      await planet.save()
    }
  }

  Response.success(res, {
    clan_id: clan.id,
    remain_fuel: clan.properties.fuel,
    owned_planets: clan.owned_planet_ids,
    confirm_require: transaction.confirmer.length,
    confirmer: transaction.confirmer,
    transaction_status: transaction.status
  })
})

export default handler