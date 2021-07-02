import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/admin'

import * as Response from '@/utils/response'

import Clan from '@/models/clan'
import Transaction from '@/models/transaction'
import Planet from '@/models/planet'
import User from '@/models/user'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

/**
 * @method POST
 * @endpoint /api/admin/godmod
 * @description add/del resoureces by admin-god-moderator power
 * @description assign someone as a clan leader
 * @description positive resource to add/ negative resource to del
 * 
 * @body clan_id *required
 * @body money,fuel,planet_id,leader_id,fuel_rate *optional
 * 
 * @require Admin authentication
 */
handler.post(async (req, res) => {
  const money = parseInt(req.body.money) || 0
  const fuel = parseInt(req.body.fuel) || 0
  const planetId = parseInt(req.body.planet_id) || 0
  const clanId = parseInt(req.body.clan_id)
  const leaderId = parseInt(req.body.leader_id) || 0
  const fuelRate = parseInt(req.body.fuel_rate) || 3

  if (isNaN(clanId))
    return Response.denined(res, 'clan id is invalid')

  if ((money == 0) && (fuel == 0) && (planetId == 0) && (leaderId == 0))
    return Response.denined(res, 'invalid input')

  const clan = await Clan
    .findById(clanId)
    .select('properties owned_planet_ids leader')
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

  if (planetId != 0) {
    const planet = await Planet
      .findById(Math.abs(planetId))
      .select('owner')

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
    } else { //remove planet
      if (planet.owner != clanId)
        return Response.denined(res, 'this planet is not owned by this clan')

      planet.owner = 0
      let index = clan.owned_planet_ids.indexOf(Math.abs(planetId))
      clan.owned_planet_ids.splice(index, 1)
    }
    await planet.save()
  }

  await clan.save()

  const transaction = await Transaction.create({
    owner: {
      id: req.user.id,
      type: 'user'
    },
    receiver: {
      id: clanId,
      type: 'clan'
    },
    status: 'SUCCESS',
    item: {
      money: money,
      fuel: fuel,
      planets: [planetId]
    }
  })

  Response.success(res, {
    clan_data: clan,
    transaction_data: transaction
  })
})

export default handler