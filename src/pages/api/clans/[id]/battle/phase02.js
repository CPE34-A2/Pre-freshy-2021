import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'
import * as Response from '@/utils/response'

import Battle from '@/models/battle'
import Planet from '@/models/planet'
import Clan from '@/models/clan'

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

  if (!battleId || !mongoose.Types.ObjectId.isValid(battleId))
    return Response.denined(res, 'bro... you just... sent wrong battle')

  const battle = await Battle
    .findById(battleId)
    .select()
    .exec()

  if (!battle)
    return Response.denined(res, 'battle not found')

  if (battle.defender != req.user.clan_id)
    return Response.denined(res, 'You are not the defender of the battle')

  if (battle.current_phase != 2 || battle.phase01.confirmer < battle.confirm_require + 1)
    return Response.denined(res, 'This battle is not phase02')

  if (battle.phase02.status == 'SUCESS')
    return Response.denined(res, 'you are too late!!! this confirmation is already SUCCESS')

  if (battle.phase02.status == 'REJECT')
    return Response.denined(res, 'you are too late!!! this confirmation is already REJECT')

  if (battle.phase02.rejector.includes(req.user.id))
    return Response.denined(res, `Don't be indecisive. Once you done something, you can't take it back :P`)

  if (battle.phase02.confirmer.includes(req.user.id))
    return Response.denined(res, 'you just already accepted it. Didn\'t you remember that?????')

  battle.phase02.confirmer.push(req.user.id)
  await battle.save()

  // If the confirmer equal to expected require, then doing next
  if (battle.phase02.confirmer.length < battle.confirm_require) {
    return Response.success(res, 'confirm done')
  }

  battle.phase02.status = 'SUCCESS'
  battle.phase03.confirmer = []
  battle.phase03.status = 'PENDING'
  battle.current_phase = 3
  await battle.save()

  Response.success(res, battle)
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

  if (!battleId || !mongoose.Types.ObjectId.isValid(battleId))
    return Response.denined(res, 'bro... you just... sent wrong battle_id')

  const battle = await Battle
    .findById(battleId)
    .select()
    .exec()

  if (!battle)
    return Response.denined(res, 'battle not found')

  if (battle.defender != req.user.clan_id)
    return Response.denined(res, 'You are not the defender, what do you want??????')

  if (battle.phase02 == 'SUCCESS')
    return Response.denined(res, 'you are too late!!! this confirmation is already SUCCESS')

  if (battle.phase02 == 'REJECT')
    return Response.denined(res, 'you are too late!!! this confirmation is already REJECT')

  if (battle.phase02.confirmer.includes(req.user.id))
    return Response.denined(res, `Don't be indecisive. Once you accepted the war, You can't unaccept it.`)

  if (battle.phase02.rejector.includes(req.user.id))
    return Response.denined(res, `you just already refused it. Didn't you remember that?????`)

  battle.phase02.rejector.push(req.user.id)

  if (battle.phase02.rejector.length >= battle.confirm_require) {
    const attackerPlanet = await Planet
      .findById(battle.attacker)
      .select()
      .exec()

    const defenderPlanet = await Planet
      .findById(battle.target_planet_id)
      .select()
      .exec()

    const penaltyPlanetPoint = parseInt(defenderPlanet.point / 4.0)
    attackerPlanet.point = attackerPlanet.point + penaltyPlanetPoint
    defenderPlanet.point = defenderPlanet.point - penaltyPlanetPoint

    const attackerClan = await Clan
      .findById(battle.attacker)
      .select()
      .exec()
    
    attackerClan.properties.fuel += parseInt((defenderPlanet.travel_cost * 2 ) / 3)
    attackerClan.position = attackerClan._id
    attackerClan.properties.fuel += battle.stakes.fuel
    attackerClan.properties.money += battle.stakes.money

    battle.phase02.status = 'REJECT'
    battle.status = 'DENIED'

    await attackerClan.save()
    await attackerPlanet.save()
    await defenderPlanet.save()
    await battle.save()
  }
    
  await battle.save()

  Response.success(res, battle)
})

export default handler