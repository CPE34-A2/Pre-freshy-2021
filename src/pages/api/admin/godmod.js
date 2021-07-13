import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/admin'

import * as Response from '@/utils/response'

import Clan from '@/models/clan'
import Planet from '@/models/planet'
import User from '@/models/user'
import Transaction from '@/models/transaction'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

/**
 * @method GET
 * @endpoint /api/admin/godmod
 * @description add/del resoureces by admin-god-moderator power
 * @description assign someone as a clan leader
 * @description positive resource to add/ negative resource to del
 * 
 * @param clan_id *required
 * @param money,fuel,planet_id,leader_id,fuel_rate *optional
 * 
 * @require Admin authentication
 */
handler.get(async (req, res) => {
  const money = parseInt(req.query.money) || 0
  const fuel = parseInt(req.query.fuel) || 0
  const planetId = parseInt(req.query.planet_id) || 0
  const clanId = parseInt(req.query.clan_id)
  const leaderId = parseInt(req.query.leader_id) || 0
  const fuelRate = parseInt(req.query.fuel_rate) || 3

  if (isNaN(clanId))
    return Response.denined(res, 'clan id is invalid')

  if ((money == 0) && (fuel == 0) && (planetId == 0) && (leaderId == 0))
    return Response.denined(res, 'invalid input')

  const clan = await Clan
    .findById(clanId)
    .exec()

  if (!clan)
    return Response.denined(res, 'clan not found')

  if (fuelRate <= 0) {
    return Response.denined(res, 'fuel rate cannot be below 0')
  }

  if (leaderId != 0) {
    const user = await User
      .findById(leaderId)
      .select('clan_id')
      .lean()
      .exec()

    if (!user) {
      return Response.denined(res, 'user not found')
    }

    if (user.clan_id != clanId) {
      return Response.denined(res, 'this user is not from this clan')
    }

    clan.leader = user._id
  }

  if ((clan.properties.money + money < 0) || (clan.properties.fuel + fuel < 0))
    return Response.denined(res, `Resources can't go below 0`)

  clan.properties.money += money
  clan.properties.fuel += fuel
  
  if (fuelRate != 3) {
    clan.fuel_rate = fuelRate
  }

  let planet

  if (planetId != 0) {
    planet = await Planet
      .findById(Math.abs(planetId))
      .select('-__v -quest -redeem')
      .exec()

    if (!planet)
      return Response.denined(res, 'planet not found')

    //add planet
    if (planetId > 0) {
      if (planet.owner == clanId)
        return Response.denined(res, 'this planet is already owned by this clan')

      if (planet.owner != 0)
        return Response.denined(res, `this planet is already owned by clan ${planet.owner}`)

      planet.owner = clan._id
      clan.owned_planet_ids = [...clan.owned_planet_ids, planet]

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
      req.socket.server.io.emit('set.transaction', clan._id, transaction)

    } else { //remove planet
      if (planet.owner != clanId)
        return Response.denined(res, 'this planet is not owned by this clan')

      planet.owner = 0
      let index = clan.owned_planet_ids.indexOf(Math.abs(planetId))
      clan.owned_planet_ids.splice(index, 1)
    }
    
    await planet.save()
    req.socket.server.io.emit('set.planet', planet._id, planet)
  }

  await clan.save()

  req.socket.server.io.emit('set.clan', clan._id, clan)

  Response.success(res, {
    clan_data: clan,
  })
})

export default handler