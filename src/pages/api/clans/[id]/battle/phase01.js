import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'
import * as Response from '@/utils/response'

import Clan from '@/models/clan'
import Planet from '@/models/planet'
import Battle from '@/models/battle'

import moment from 'moment'

const handler = nextConnect()

const MONEY_POINT_PER_UNIT = 1 / 2
const FUEL_POINT_PER_UNIT = 1 / 6
const EXPECTED_REQUIRER = 3

handler
  .use(middleware)
  .use(permission)

/**
* @method Post
* @endpoint /api/clans/:id/battle/phase01
* @description 
* 
* @body bet_money
* @body bet_fuel
* @body bet_planet_ids
* @body target_planet
* 
* @require User authentication / Clan leadership
*/
handler.post(async (req, res) => {
  const betMoney = parseInt(req.body.bet_money) || 0
  const betFuel = parseInt(req.body.bet_fuel) || 0
  let betPlanetIds = req.body.bet_planet_ids
  const targetPlanetId = parseInt(req.body.target_planet)

  betPlanetIds ? betPlanetIds = [...new Set(betPlanetIds.split(',').map((e) => parseInt(e)))] : betPlanetIds = []

  if (betPlanetIds.includes(NaN))
    return Response.denined(res, 'bet_planet_ids is invalid')

  if (isNaN(betMoney))
    return Response.denined(res, 'bet_money is not a number')

  if (isNaN(betFuel))
    return Response.denined(res, 'bet_Fuel is not a number')

  // validating about attacker
  const pendingAttackAttacker = await Battle
    .findOne({ 'attacker': req.user.clan_id, 'status': 'PENDING' })
    .select()
    .lean()
    .exec()

  if (pendingAttackAttacker)
    return Response.denined(res, `You are currently attacking other. You cannot declare a war to another one.`)

  const attackerClan = await Clan
    .findById(req.user.clan_id)
    .select()
    .exec()

  if (attackerClan.leader != req.user.id)
    return Response.denined(res, 'This is very important!!! ask your leader to preform this action!!!!')

  const attackerPlanets = await Planet
    .find({ 'owner': req.user.clan_id, '_id': { $in: betPlanetIds } })
    .select()
    .exec()

  let attackedError = false
  let homeError = false

  attackerPlanets.forEach((e) => {
    if (e.visitor != 0)
      attackedError = true
    if (e._id == req.user.clan_id)
      homeError = true
  })

  if (attackedError) {
    return Response.denined(res, `Your stake planets is under attack!!!`)
  }

  if (homeError) {
    return Response.denined(res, `Your can't stake your home planet`)
  }

  const attackerPlanetIds = attackerPlanets.map(e => e._id)

  if (betPlanetIds.filter(e => !attackerPlanetIds.includes(e)) != 0)
    return Response.denined(res, `imagine using someone else's planet to bet your battle`)

  // validating about defender
  const defenderPlanet = await Planet
    .findById(targetPlanetId)
    .select()
    .lean()
    .exec()

  if (!defenderPlanet)
    return Response.denined(res, `target planet not found!!! Are you attacking the void???`)

  if (defenderPlanet.tier == 'X')
    return Response.denined(res, `You cannot attack the special planet`)

  if (defenderPlanet.owner == 0)
    return Response.denined(res, `This planet has no owner`)

  if (defenderPlanet.owner == defenderPlanet._id)
    return Response.denined(res, `You cannot attack the hometown planet`)

  if (defenderPlanet.owner == attackerClan._id)
    return Response.denined(res, `You can't attack yourself`)

  if (defenderPlanet.visitor != 0)
    return Response.denined(res, `The target planet is under attack!!!!`)

  const latestPlanetAttacked = await Battle
    .findOne({ target_planet_id: defenderPlanet._id, status: {$in: ['ATTACKER_WON', 'DEFENDER_WON']}, updatedAt: { $gte: moment().add(-24, 'hours').toDate(), $lt: moment().toDate()} })
    .select()
    .lean()
    .exec()

  if (latestPlanetAttacked)
    return Response.denined(res, `The target planet has attacked cooldown (remaining time: ${moment.utc(moment(latestPlanetAttacked.updatedAt).diff(moment())).format("HH:mm:ss")})`)

  // validating properties of attacker
  if (attackerClan.properties.money < betMoney)
    return Response.denined(res, `low money`)
  if (attackerClan.properties.fuel < betFuel + defenderPlanet.travel_cost)
    return Response.denined(res, `low fuel to travel`)

  const betWeight = (betMoney * MONEY_POINT_PER_UNIT) + (betFuel * FUEL_POINT_PER_UNIT) + (attackerPlanets.map(e => e.point).reduce((a, b) => a + b, 0))

  if (betWeight < defenderPlanet.point)
    return Response.denined(res, `Total stakes worth less than the planet's point`)

  const battle = await Battle.create({
    current_phase: 1,
    attacker: req.user.clan_id,
    defender: defenderPlanet.owner,
    stakes: {
      money: betMoney || 0,
      fuel: betFuel || 0,
      planet_ids: betPlanetIds || []
    },
    target_planet_id: targetPlanetId,
    confirm_require: EXPECTED_REQUIRER,
    phase01: {
      confirmer: [req.user.id],
      rejector: [],
      status: 'PENDING'
    },
    status: 'PENDING'
  })

  req.socket.server.io.emit('set.battle', [battle.attacker, battle.defender], battle)
  
  Response.success(res, battle)
})


/**
 * @method Patch
 * @endpoint /api/clans/:id/battle/phase01
 * @description 
 * 
 * @body battle_id
 * 
 * @require User authentication
 */
handler.patch(async (req, res) => {
  const battleId = req.body.battle_id

  // validate the battle_id
  if (!battleId || !mongoose.Types.ObjectId.isValid(battleId))
    return Response.denined(res, `Voted failed: bro... you just... sent wrong battle_id`)

  const battle = await Battle
    .findById(battleId)
    .select()
    .exec()

  if (!battle)
    return Response.denined(res, `Voted failed: battle not found`)

  if (battle.attacker != req.user.clan_id)
    return Response.denined(res, `Voted failed: This battle is belong to other clan. What do you want???`)

  if (battle.current_phase != 1)
    return Response.denined(res, `Voted failed: This battle is not phase01`)

  if (battle.phase01.status == 'SUCCESS')
    return Response.denined(res, `Voted failed: battle already success`)

  if (battle.phase01.status === 'REJECT')
    return Response.denined(res, `Voted failed: battle already rejected`)

  // validate the relation between battle planet and stake.
  const defenderPlanet = await Planet
    .findById(battle.target_planet_id)
    .exec()

  const attackerClan = await Clan
    .findById(req.user.clan_id)
    .exec()

  if (attackerClan.properties.fuel < defenderPlanet.travel_cost + battle.stakes.fuel) {
    battle.status = 'REJECT'
    battle.phase01.status = 'REJECT'
    await battle.save()
    return Response.success(res, `Battle rejected: Clan's fuel is not enough for traveling and staking`)
  }

  if (attackerClan.properties.money < battle.stakes.money) {
    battle.status = 'REJECT'
    battle.phase01.status = 'REJECT'
    await battle.save()
    return Response.success(res, `Battle rejected: Clan's money is not enough for staking`)
  }

  if (battle.stakes.planet_ids.filter(e => !attackerClan.owned_planet_ids.includes(e)).length) {
    battle.status = 'REJECT'
    battle.phase01.status = 'REJECT'
    await battle.save()
    return Response.success(res, `Battle rejected: Clan's planets is not enough for staking`)
  }

  if (defenderPlanet.visitor != 0) {
    battle.status = 'REJECT'
    battle.phase01.status = 'REJECT'
    await battle.save()
    return Response.denined(res, `Battle rejected: The target planet is under attack!!!!`)
  }

  const attackerPlanets = await Planet
    .find({ 'owner': req.user.clan_id, '_id': { $in: battle.stakes.planet_ids } })
    .exec()

  let attackedError = false

  attackerPlanets.forEach(async (e) => {
    if (e.visitor != 0) {
      battle.status = 'REJECT'
      battle.phase01.status = 'REJECT'
      attackedError = true
    }
  })

  if (attackedError) {
    await battle.save()
    return Response.denined(res, `Battle rejected: Stake planets are under attack!!!`)
  }

  // validate the voter and reqester
  if (battle.phase01.rejector.includes(req.user.id))
    return Response.denined(res, `Voted failed: You already rejected the vote`)

  if (battle.phase01.confirmer.includes(req.user.id))
    return Response.denined(res, `Voted failed: You already accepted the vote`)

  // save the voter to confirmer
  battle.phase01.confirmer.push(req.user.id)
  await battle.save()

  // If the confirmer equal to expected require, then lock the properties of attacker and going to the next phase
  if (battle.confirm_require + 1 == battle.phase01.confirmer.length) {
    attackerClan.properties.fuel -= defenderPlanet.travel_cost
    attackerClan.properties.fuel -= battle.stakes.fuel
    attackerClan.properties.money -= battle.stakes.money
    attackerClan.position = battle.target_planet_id
    defenderPlanet.visitor = battle.attacker
    await attackerClan.save()
    await defenderPlanet.save()

    battle.phase01.status = 'SUCCESS'

    battle.phase02.confirmer = []
    battle.phase02.rejector = []
    battle.phase02.status = 'PENDING'

    battle.current_phase = 2
    await battle.save()

    req.socket.server.io.emit('set.clan', attackerClan._id, attackerClan)
    req.socket.server.io.emit('set.clan.money', attackerClan._id, attackerClan.properties.money)
    req.socket.server.io.emit('set.clan.fuel', attackerClan._id, attackerClan.properties.fuel)
    req.socket.server.io.emit('set.clan.planets', attackerClan._id, attackerClan.owned_planet_ids)

    delete defenderPlanet.redeem
    req.socket.server.io.emit('set.planet', defenderPlanet._id, defenderPlanet)
  }

  req.socket.server.io.emit('set.battle', [battle.attacker, battle.defender], battle)

  return Response.success(res, battle)
})

/**
 * @method Delete
 * @endpoint /api/clans/:id/battle/phase01
 * @description 
 * 
 * @body battle_id
 * 
 * @require User authentication
 */
handler.delete(async (req, res) => {
  const battleId = req.body.battle_id

  // validate the battle_id
  if (!battleId || !mongoose.Types.ObjectId.isValid(battleId))
    return Response.denined(res, `Voted failed: bro... you just... sent wrong battle_id`)

  const battle = await Battle
    .findById(battleId)
    .select()
    .exec()

  if (!battle)
    return Response.denined(res, `Voted failed: battle not found`)

  if (battle.attacker != req.user.clan_id)
    return Response.denined(res, `Voted failed: This battle is belong to other clan. What do you want???`)

  if (battle.current_phase != 1)
    return Response.denined(res, `Voted failed: This battle is not phase01`)

  if (battle.phase01.status == 'SUCCESS')
    return Response.denined(res, `Voted failed: battle already success`)

  if (battle.phase01.status === 'REJECT')
    return Response.denined(res, `Voted failed: battle already rejected`)

  // validate the relation between battle planet and stake.
  const defenderPlanet = await Planet
    .findById(battle.target_planet_id)
    .select()
    .lean()
    .exec()

  const attackerClan = await Clan
    .findById(req.user.clan_id)
    .select()
    .lean()
    .exec()

  if (attackerClan.properties.fuel < defenderPlanet.travel_cost + battle.stakes.fuel) {
    battle.status = 'REJECT'
    battle.phase01.status = 'REJECT'
    await battle.save()
    return Response.success(res, `Battle rejected: Clan's fuel is not enough for traveling and staking`)
  }

  if (attackerClan.properties.money < battle.stakes.money) {
    battle.status = 'REJECT'
    battle.phase01.status = 'REJECT'
    await battle.save()
    return Response.success(res, `Battle rejected: Clan's money is not enough for staking`)
  }

  if (battle.stakes.planet_ids.filter(e => !attackerClan.owned_planet_ids.includes(e)).length) {
    battle.status = 'REJECT'
    battle.phase01.status = 'REJECT'
    await battle.save()
    return Response.success(res, `Battle rejected: Clan's planets is not enough for staking`)
  }

  if (defenderPlanet.visitor != 0) {
    battle.status = 'REJECT'
    battle.phase01.status = 'REJECT'
    await battle.save()
    return Response.denined(res, `Battle rejected: The target planet is under attack!!!!`)
  }

  const attackerPlanets = await Planet
    .find({ 'owner': req.user.clan_id, '_id': { $in: battle.stakes.planet_ids } })
    .select()
    .exec()

  let attackedError = false

  attackerPlanets.forEach(async (e) => {
    if (e.visitor != 0) {
      battle.status = 'REJECT'
      battle.phase01.status = 'REJECT'
      attackedError = true
    }
  })

  if (attackedError) {
    await battle.save()
    return Response.denined(res, `Battle rejected: Stake planets are under attack!!!`)
  }

  const clan = await Clan
    .findById(req.user.clan_id)
    .select('properties leader')
    .exec()

  if (battle.phase01.confirmer.includes(req.user.id) && (req.user.id != clan.leader))
    return Response.denined(res, `Voted failed: You already accepted the vote`)

  if (battle.phase01.rejector.includes(req.user.id))
    return Response.denined(res, `Voted failed: You already rejected the vote`)

  // save the voter to rejector
  battle.phase01.rejector.push(req.user.id)

  // If the rejector equal to expected require, then the battle will be rejected
  if ((battle.confirm_require <= battle.phase01.rejector.length) || (req.user.id == clan.leader)) {
    battle.phase01.status = 'REJECT'
    battle.status = 'REJECT'
  }

  await battle.save()
  req.socket.server.io.emit('set.battle', [battle.attacker, battle.defender], battle)

  Response.success(res, battle)
})

export default handler