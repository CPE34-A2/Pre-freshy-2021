import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'
import * as Response from '@/utils/response'

import Clan from '@/models/clan'
import Planet from '@/models/planet'
import Battle from '@/models/battle'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

/**
 * @method Patch
 * @endpoint /api/clans/:id/battle/phase02
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

  if (battle.defender != req.user.clan_id)
    return Response.denined(res, 'Voted failed: You are not the defender of the battle')

  if (battle.current_phase != 2)
    return Response.denined(res, `Voted failed: This battle is not phase02`)

  if (battle.phase02.status == 'SUCCESS')
    return Response.denined(res, `Voted failed: battle already success`)

  if (battle.phase02.status === 'REJECT')
    return Response.denined(res, `Voted failed: battle already rejected`)

  // validate the voter and reqester
  if (battle.phase02.rejector.includes(req.user.id))
    return Response.denined(res, `Voted failed: You already rejected the vote`)

  if (battle.phase02.confirmer.includes(req.user.id))
    return Response.denined(res, `Voted failed: You already accepted the vote`)

  // save the voter to confirmer
  battle.phase02.confirmer.push(req.user.id)
  await battle.save()

  // If the confirmer equal to expected require, then going to the next phase
  if (battle.phase02.confirmer.length == battle.confirm_require) {
    battle.phase02.status = 'SUCCESS'
    battle.current_phase = 3
    await battle.save()
  }

  req.socket.server.io.emit('set.battle', [battle.attacker, battle.defender], battle)

  return Response.success(res, battle)
})

/**
 * @method Delete
 * @endpoint /api/clans/:id/battle/phase02
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

  if (battle.defender != req.user.clan_id)
    return Response.denined(res, 'Voted failed: You are not the defender of the battle')

  if (battle.current_phase != 2)
    return Response.denined(res, `Voted failed: This battle is not phase02`)

  if (battle.phase02.status == 'SUCCESS')
    return Response.denined(res, `Voted failed: battle already success`)

  if (battle.phase02.status === 'REJECT')
    return Response.denined(res, `Voted failed: battle already rejected`)

  // validate the voter and reqester
  if (battle.phase02.rejector.includes(req.user.id))
  return Response.denined(res, `Voted failed: You already rejected the vote`)

  if (battle.phase02.confirmer.includes(req.user.id))
  return Response.denined(res, `Voted failed: You already accepted the vote`)

  // save the voter to rejector
  battle.phase02.rejector.push(req.user.id)

  // If the rejector equal to expected require, then the battle will be rejected and the lock properties will return to attacker clan
  if (battle.phase02.rejector.length == battle.confirm_require) {
    const attackerPlanet = await Planet
      .findById(battle.attacker)
      .exec()

    const defenderPlanet = await Planet
      .findById(battle.target_planet_id)
      .exec()

    const penaltyPlanetPoint = parseInt(defenderPlanet.point / 4.0)
    attackerPlanet.point = attackerPlanet.point + penaltyPlanetPoint
    defenderPlanet.point = defenderPlanet.point - penaltyPlanetPoint

    const attackerClan = await Clan
      .findById(battle.attacker)
      .exec()

    attackerClan.properties.fuel += parseInt((defenderPlanet.travel_cost * 2) / 3)
    attackerClan.position = attackerClan._id
    attackerClan.properties.fuel += battle.stakes.fuel
    attackerClan.properties.money += battle.stakes.money
    defenderPlanet.visitor = 0

    battle.phase02.status = 'REJECT'
    battle.status = 'DENIED'

    await attackerClan.save()
    await attackerPlanet.save()
    await defenderPlanet.save()

    req.socket.server.io.emit('set.clan', attackerClan._id, attackerClan)
    req.socket.server.io.emit('set.clan.money', attackerClan._id, attackerClan.properties.money)
    req.socket.server.io.emit('set.clan.fuel', attackerClan._id, attackerClan.properties.fuel)
    req.socket.server.io.emit('set.clan.planets', attackerClan._id, attackerClan.owned_planet_ids)

    delete attackerPlanet.redeem
    delete defenderPlanet.redeem
    req.socket.server.io.emit('set.planet', attackerPlanet._id, attackerPlanet)
    req.socket.server.io.emit('set.planet', defenderPlanet._id, defenderPlanet)
  }

  await battle.save()
  req.socket.server.io.emit('set.battle', [battle.attacker, battle.defender], battle)

  Response.success(res, battle)
})

export default handler