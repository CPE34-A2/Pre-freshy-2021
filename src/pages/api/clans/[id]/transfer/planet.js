import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'
import * as Response from '@/utils/response'
import mongoose from 'mongoose'

import Planet from '@/models/planet'
import Clan from '@/models/clan'
import Transaction from '@/models/transaction'
import User from '@/models/user'

const handler = nextConnect()

const PLANET_CONFIRM_REQUIRE = 3

handler
  .use(middleware)
  .use(permission)

/**
 * @method GET
 * @endpoint /api/clans/:id/transfer/planet
 * @description Get the pending fuel trasaction
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
  const clanId = parseInt(req.query.id)
  let transaction = null

  if (!isNaN(clanId)) {
    transaction = await Transaction
      .findOne({ 'owner.type': 'planet', 'receiver.id': clanId, 'status': 'PENDING' })
      .lean()
      .exec()

    if (transaction) {
      const planet = await Planet
        .findById(transaction.owner.id)
        .select('name _id')
        .lean()
        .exec()

      delete transaction.item.planets
      transaction.item.planet = {}
      transaction.item.planet.id = planet._id
      transaction.item.planet.name = planet.name
    }
  }

  res
    .status(transaction ? 200 : 400)
    .json({
      sucesss: !!transaction,
      data: transaction,
      timestamp: new Date()
    })
})

/**
 * @method post
 * @endpoint /api/clans/:id/transfer/planet
 * @description Get owner on planet (need summit)
 * 
 * @body target_planet
 * 
 * @require User authentication
 */
handler.post(async (req, res) => {
  const targetPlanet = parseInt(req.body.target_planet)

  if (isNaN(targetPlanet) || targetPlanet < 0) {
    return Response.denined(res, 'targetPlanet is not number or is under 0')
  }

  const clan = await Clan
    .findById(req.query.id)
    .exec()

  const user = await User
    .findById(req.user.id)
    .lean()
    .exec()

  if (!clan)
    return Response.denined(res, 'clan not found')

  if ((clan.leader != req.user.id) && (user.role != 'admin')) {
    return res.status(403).json({ message: 'You arent clan leader' })
  }

  const planet = await Planet
    .findOne({ _id: targetPlanet })
    .select('_id travel_cost owner')
    .exec()

  const dupeTransaction = await Transaction
    .findOne({
      "owner.type": 'planet',
      "receiver.id": clan.id,
      status: 'PENDING'
    })

  if (dupeTransaction) {
    return Response.denined(res, 'There are still pending transactions')
  }

  if (planet.owner != 0) {
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
      id: planet._id,
      type: 'planet'
    },
    receiver: {
      id: clan._id,
      type: 'clan'
    },
    status: 'PENDING',
    confirm_require: PLANET_CONFIRM_REQUIRE,
    confirmer: [req.user.id],
    rejector: [],
    item: {
      fuel: planet.travel_cost,
      planets: [targetPlanet]
    }
  })

  Response.success(res, {
    transaction_id: transaction._id,
    transaction_status: transaction.status,
    confirm_require: transaction.confirm_require,
    confirmer: transaction.confirmer,
    clan_fuel: clan.properties.fuel,
    target_planet: targetPlanet
  })
})

/**
 * @method patch
 * @endpoint /api/clans/:id/transfer/planet
 * @description submmit to confirm
 * 
 * @body transaction_id
 * 
 * @require User authentication
 */
handler.patch(async (req, res) => {
  let transactionid = req.body.transaction_id

  if (!mongoose.Types.ObjectId.isValid(transactionid)) {
    return Response.denined(res, 'Invalid transaction id')
  }

  let transaction = await Transaction
    .findById(transactionid)
    .exec()

  if (transaction.receiver.id != req.user.clan_id) {
    return Response.denined(res, 'You are not the owner of this transaction')
  }

  if (!transaction) {
    return Response.denined(res, 'Transaction not found')
  }

  if (transaction.status === 'SUCCESS') {
    return Response.denined(res, 'Transaction already successed')
  }

  if (transaction.status === 'REJECT') {
    return Response.denined(res, 'Transaction already rejected')
  }

  if (transaction.rejector.includes(req.user.id)) {
    return Response.denined(res, 'You already rejected')
  }

  if (transaction.confirmer.includes(req.user.id)) {
    return Response.denined(res, 'You already accepted')
  }

  let clan = await Clan
    .findById(req.query.id)
    .exec()

  const planet = await Planet
    .findOne({ _id: transaction.item.planets })
    .select('_id travel_cost quest')
    .lean()
    .exec()

  transaction.confirmer.push(req.user.id)

  if (transaction.confirmer.length >= transaction.confirm_require + 1) {
    if (clan.properties.fuel < planet.travel_cost) {
      transaction.status = 'REJECT'
      await transaction.save()
      return Response.denined(res, 'fuel is not enough. Transaction closed')
    }

    clan.properties.fuel -= planet.travel_cost
    clan.position = planet._id
    await clan.save()

    transaction.status = 'SUCCESS'
  }

  await transaction.save()

  req.socket.server.io.emit('set.task.travel', req.user.clan_id,
    transaction.status == 'PENDING' ? transaction : null
  )

  Response.success(res, {
    planet_quest: transaction.status == 'SUCCESS' ? planet.quest : '',
    clan_id: clan.id,
    transaction_status: transaction.status,
    remain_fuel: clan.properties.fuel,
    target_planet: transaction.item.planets,
    confirm_require: transaction.confirm_require,
    confirmer: transaction.confirmer,
    rejector: transaction.rejector,
    owned_planets: clan.owned_planet_ids
  })
})

/**
 * @method delete
 * @endpoint /api/clans/:id/transfer/planet
 * @description submmit to reject
 * 
 * @body transaction_id
 * 
 * @require User authentication
 */
handler.delete(async (req, res) => {
  let transactionid = req.body.transaction_id

  if (!mongoose.Types.ObjectId.isValid(transactionid)) {
    return Response.denined(res, 'Invalid transaction id')
  }

  let transaction = await Transaction
    .findById(transactionid)
    .exec()

  let clan = await Clan
    .findById(req.query.id)
    .select('properties leader owned_planet_ids')
    .exec()

  if (!transaction) {
    return Response.denined(res, 'Transaction not found')
  }

  if (transaction.receiver.id != req.user.clan_id) {
    return Response.denined(res, 'You are not the owner of this transaction')
  }

  if (transaction.status === 'SUCCESS') {
    return Response.denined(res, 'Transaction already successed')
  }

  if (transaction.status === 'REJECT') {
    return Response.denined(res, 'Transaction already rejected')
  }

  if (transaction.rejector.includes(req.user.id)) {
    return Response.denined(res, 'You already rejected')
  }

  if (transaction.confirmer.includes(req.user.id) && (req.user.id != clan.leader)) {
    return Response.denined(res, 'You already accepted')
  }

  transaction.rejector.push(req.user.id)

  if ((transaction.rejector.length == transaction.confirm_require) || (req.user.id == clan.leader)) {
    transaction.status = 'REJECT'
  }

  await transaction.save()

  req.socket.server.io.emit('set.task.travel', req.user.clan_id,
    transaction.status == 'PENDING' ? transaction : null
  )

  Response.success(res, {
    transaction_status: transaction.status,
    clan_id: clan.id,
    remain_fuel: clan.properties.fuel,
    target_planet: transaction.item.planets,
    confirm_require: transaction.confirm_require,
    confirmer: transaction.confirmer,
    rejector: transaction.rejector,
    owned_planets: clan.owned_planet_ids
  })
})

export default handler