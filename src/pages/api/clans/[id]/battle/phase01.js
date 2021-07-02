import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'
import * as Response from '@/utils/response'

import Clan from '@/models/clan'
import Planet from '@/models/planet'


const handler = nextConnect()

const MONEY_POINT_PER_UNIT = 1 / 2
const FUEL_POINT_PER_UNIT = 1 / 6
const EXPECTED_REQUIRER = 3

handler
  .use(middleware)
  .use(permission)

/**
 * @method Post
 * @endpoint /api/clans/:id/battle
 * @description 
 * 
 * @body bet_money
 * @body bet_fuel
 * @body bet_planets
 * @body target_planet
 * 
 * @require User authentication / Clan leadership
 */
handler.post(async (req, res) => {
  const betMoney = req.body.bet_money
  const betFuel = req.body.bet_fuel
  const betPlanetIds = req.body.bet_planet_ids.split(',').map((e) => { return parseInt(e) })
  const targetPlanetId = req.body.target_planet_id

  if (isNaN(betMoney))
    return Response.denined(res, 'bet_money is not a number')

  if (isNaN(betFuel))
    return Response.denined(res, 'bet_Fuel is not a number')

  betPlanetIds.map((e) => {
    if (isNaN(e))
      return Response.denined(res, 'invalid betPlanet')
  })

  // TODO: Check duplicate battle
  // const duplicateTransaction = await Transaction.findOne({'owner.id': req.user.clan_id , 'status': 'PENDING'}).select().lean().exec()
  // if (duplicateTransaction && duplicateTransaction.target_planet_id)
  //   return Response.denined(res, 'There are still pending battle transaction')

  const attakerClan = await Clan
    .findById(req.user.clan_id)
    .select()
    .exec()

  if (attakerClan.leader != req.user.id)
    return Response.denined(res, 'This is very important!!! ask your leader to preform this action!!!!')

  const attackerPlanets = await Planet
    .find({ 'owner': req.user.clan_id, '_id': { $in: betPlanetIds } })
    .select()
    .exec()

  const attackerPlanetIds = attackerPlanets.map(e => e._id)

  if (betPlanetIds.filter(e => !attackerPlanetIds.includes(e)) != 0)
    return Response.denined(res, `imagine using someone else's planet to bet your battle`)

  const defenderPlanet = await Planet
    .findById(targetPlanetId)
    .select()
    .lean()
    .exec()

  if (!defenderPlanet)
    return Response.denined(res, `target planet not found!!! Are you attacking the void???`)

  if (defenderPlanet.owner == 0)
    return Response.denined(res, `This planet has no owner`)

  if (attakerClan.properties.money < betMoney)
    return Response.denined(res, `low money`)
  
  if (attakerClan.properties.fuel < betFuel)
    return Response.denined(res, `low fuel`)

  const betWeight = (betMoney * MONEY_POINT_PER_UNIT) + (betFuel * FUEL_POINT_PER_UNIT) + (attackerPlanets.map(e => e.point).reduce((a, b) => a + b, 0))

  if (betWeight < defenderPlanet.point)
    return Response.denined(res, `Did you think the diamond's value is as same as the coal's one?`)

  const battle = await Battle.create({
    current_phase: 1,
    attacker: req.user.clan_id,
    defender: defenderPlanet.owner,
    stakes: {
      money: betMoney || 0,
      fuel: betFuel || 0,
      planet: betPlanetIds || []
    },
    target_planet_id: targetPlanetId,
    confirm_require: EXPECTED_REQUIRER,
    phase01: {
      confirmer: [req.user.id],
      rejector: [],
      status: PENDING
    }
  })

  Response.success(res, battle)
})

/**
 * @method Patch
 * @endpoint /api/clans/:id/battle
 * @description 
 * 
 * @body battle_id
 * 
 * @require User authentication
 */
handler.patch(async (req, res) => {
  const battleId = req.body.battle_id

  if (!battleId || !mongoose.Types.ObjectId.isValid(battleId))
    return Response.denined(res, 'bro... you just... sent wrong battle_id')

  const battle = await Battle
    .findById(battleId)
    .select()
    .exec()

  if (!battle)
    return Response.denined(res, 'battle not found')

  if (battle.attacker != req.user.clan_id)
    return Response.denined(res, 'This battle is belong to other clan. What do you want???')

  if (battle.phase01.status == 'SUCEESS')
    return Response.denined(res, 'you are too late!!! this confirmation is already SUCCESS')

  if (battle.phase01.status === 'REJECT')
    return Response.denined(res, 'you are too late!!! this confirmation is already REJECT')

  if (battle.phase01.rejector.includes(req.user.id))
    return Response.denined(res, `Don't be indecisive. Once you done something, you can't take it back :P.`)

  if (battle.phase01.confirmer.includes(req.user.id))
    return Response.denined(res, 'you just already accepted it. Didn\'t you remember that?????')

  battle.phase01.confirmer.push(req.user.id)
  await battle.save()

  // If the confirmer equal to expected require, then doing next
  if (battle.phase01.confirmer.length < battle.confirm_require + 1)
    return Response.success(res, 'confirmed done!!!')

  const attackerClan = await Clan
    .findById(req.user.clan_id)
    .select()
    .exec()

  const defenderPlanet = await Planet
    .findById(battle.target_planet_id)
    .select()
    .lean()
    .exec()

  if (attackerClan.properties.fuel < defenderPlanet.travel_cost + stakes.fuel) {
    battle.phase01.status = 'REJECT'
    return Response.success(res, 'fuel too low!!!')
  }

  if (attackerClan.properties.money < stakes.money) {
    battle.phase01.status = 'REJECT'
    return Response.success(res, 'no money')
  }

  // TODO: check planet
  // if (attackerClan.properties.money < transaction.item.money) {
  //   transaction.status = 'REJECT'
  //   return Response.success(res, 'no planet')
  // }
    
  attackerClan.properties.fuel -= defenderPlanet.travel_cost
  attackerClan.properties.fuel -= battle.stakes.fuel
  attackerClan.properties.money -= battle.stakes.money
  await attackerClan.save()

  battle.phase01.status = 'SUCCESS'

  battle.phase02.confirmer = []
  battle.phase02.rejector = []
  battle.phase02.status = 'PENDING'

  battle.current_phase = 1
  await battle.save()
})

/**
 * @method Delete
 * @endpoint /api/clans/:id/battle
 * @description 
 * 
 * @body battle_id
 * 
 * @require User authentication
 */
handler.delete(async (req, res) => {
  const battleId = req.body.battle_id

  if (!battleId || !mongoose.Types.ObjectId.isValid(battleId))
    return Response.denined(res, 'bro... you just... sent wrong battle')

  const battle = await Battle
    .findById(battleId)
    .select()
    .exec()

  if (!battle)
    return Response.denined(res, 'battle not found')

  if (battle.attacker != req.user.clan_id)
    return Response.denined(res, 'This battle is belong to other clan. What do you want???')

  if (battle.phase01.status == 'SUCCESS')
    return Response.denined(res, 'you are too late!!! the phase01 is already SUCCESS')

  if (battle.phase01.status === 'REJECT')
    return Response.denined(res, 'you are too late!!! the phase02 is already REJECT')

  const clan = await Clan
    .findById(req.user.clan_id)
    .select('properties leader')
    .exec()

  if (battle.phase01.confirmer.includes(req.user.id) && (req.user.id != clan.leader))
    return Response.denined(res, `Don't be indecisive. Once you declare the war, You can't undo it.`)

  if (battle.phase01.rejector.includes(req.user.id))
    return Response.denined(res, `you just already rejected it. Didn't you remember that?????`)

  battle.phase01.rejector.push(req.user.id)

  if ((battle.confirm_require <= battle.phase01.rejector.length) || (req.user.id == clan.leader)) {
    battle.phase01.status = 'REJECT'
    battle.status = 'REJECT'
  }

  await battle.save()

  Response.success(res, battle)
})

export default handler