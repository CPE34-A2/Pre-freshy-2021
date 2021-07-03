import mongoose from 'mongoose';
import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/admin'

import * as Response from '@/utils/response'
import Clan from '@/models/clan'
import Battle from '@/models/battle'
import Planet from '@/models/planet'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

const COMMAND = ['REVERT', 'ATTACKER_WIN', 'DEFENDER_WIN']

/**
 * @method POST
 * @endpoint /api/admin/themis
 * @description Themis; the personification of divine order, fairness, law, natural law, and custom.
 * @description Cancel the battle like it never happened by command 'REVERT'
 * @description Judgeing attacker won by command 'ATTACKER_WIN'
 * @description Judgeing defender won by command 'DEFENDER_WIN'
 * 
 * @body battle_id
 * @body command
 * 
 * @require Admin authentication
 */
handler.post(async (req, res) => {
  var command = req.body.command
  const battleId = req.body.battle_id

  if (!command)
    return Response.denined(res, 'Please insert your command')

  command = command.toUpperCase()

  if (!COMMAND.includes(command))
    return Response.denined(res, 'unknown command')

  if (!battleId || !mongoose.Types.ObjectId.isValid(battleId))
    return Response.denined(res, 'bro... you just... sent wrong battle')

  const battle = await Battle
    .findById(battleId)
    .select()
    .exec()

  if (!battle)
    return Response.denined(res, 'battle not found')

  if (battle.status == 'ATTACKER_WON' || battle.status == 'DEFENDER_WON')
    return Response.denined(res, `This battle has been ended. You can't do anything`)

  if (battle.status == 'DENIED' || battle.status == 'REJECT')
    return Response.denined(res, `This battle is already rejected or denined, You can't do anything.`)

  // excute command phase
  if (command == 'REVERT') {
    if (battle.current_phase == 1) {
      battle.phase01.status = 'REJECT'
      battle.status == 'REJECT'
      await battle.save()

      return Response.success(res, `End phase01 compleded!!!`)
    }

    battle.phase02.status = 'REJECT'
    battle.phase03.status = 'REJECT'
    battle.phase04.status = 'REJECT'
    battle.status == 'REJECT'
    await battle.save()

    const attackerClan = await Clan
      .findById(battle.attacker)
      .select()
      .exec()

    const defenderClan = await Clan
      .findById(battle.defender)
      .select()
      .exec()

    attackerClan.properties.fuel += defenderPlanet.travel_cost
    attackerClan.properties.fuel += battle.stakes.fuel
    attackerClan.properties.money += battle.stakes.money
    attackerClan.position = attackerClan._id

    await attackerClan.save()
    await defenderClan.save()
    return Response.success(res, `The war is ended like it never happended`)
  }

  if (command == 'ATTACKER_WIN') {
    if (battle.current_phase == 1)
      return Response.denined(res, `The war is not declared yet!!! You can't force someone to be defeated`)

    const attackerClan = await Clan
      .findById(battle.attacker)
      .select()
      .exec()

    const defenderClan = await Clan
      .findById(battle.defender)
      .select()
      .exec()

    const defenderPlanet = await Planet
      .findById(battle.target_planet_id)
      .select()
      .exec()

    attackerClan.properties.fuel += defenderPlanet.travel_cost
    attackerClan.properties.fuel += battle.stakes.fuel
    attackerClan.properties.money += battle.stakes.money

    attackerClan.owned_planet_ids.push(battle.target_planet_id)
    defenderClan.owned_planet_ids.pull(battle.target_planet_id)
    defenderPlanet.owner = battle.attacker

    battle.current_phase = 4
    battle.status = 'ATTACKER_WON'

    await attackerClan.save()
    await defenderClan.save()
    await defenderPlanet.save()
    await battle.save()

    return Response.success(res, `Attacker win!!!`)
  }

  if (command == 'ATTACKER_WIN') {
    if (battle.current_phase == 1)
      return Response.denined(res, `The war is not declared yet!!! You can't force someone to be defeated`)

    const attackerClan = await Clan
      .findById(battle.attacker)
      .select()
      .exec()

    const defenderClan = await Clan
      .findById(battle.defender)
      .select()
      .exec()

    const defenderPlanet = await Planet
      .findById(battle.target_planet_id)
      .select()
      .exec()

    attackerClan.properties.fuel += defenderPlanet.travel_cost
    attackerClan.properties.fuel += battle.stakes.fuel
    attackerClan.properties.money += battle.stakes.money

    attackerClan.owned_planet_ids.push(battle.target_planet_id)
    defenderClan.owned_planet_ids.pull(battle.target_planet_id)
    defenderPlanet.owner = battle.attacker

    attackerClan.position = attackerClan._id

    battle.current_phase = 4
    battle.status = 'ATTACKER_WON'

    await attackerClan.save()
    await defenderClan.save()
    await defenderPlanet.save()
    await battle.save()

    return Response.success(res, `Attacker win!!!`)
  }

  if (command == 'DEFENDER_WIN') {
    if (battle.current_phase == 1)
      return Response.denined(res, `The war is not declared yet!!! You can't force someone to be defeated`)

    const attackerClan = await Clan
      .findById(battle.attacker)
      .select()
      .exec()

    const defenderClan = await Clan
      .findById(battle.defender)
      .select()
      .exec()

    defenderClan.properties.money += battle.stakes.money
    defenderClan.properties.fuel += battle.stakes.fuel

    defenderClan.owned_planet_ids.push(...battle.stakes.planet_ids)
    attackerClan.owned_planet_ids.pull(...battle.stakes.planet_ids)
    battle.stakes.planet_ids.forEach((e) => { e.owner = battle.defender })

    attackerClan.position = attackerClan._id

    battle.current_phase = 4
    battle.status = 'DEFENDER_WON'

    await attackerClan.save()
    await defenderClan.save()
    await battle.save()

    return Response.success(res, `Attacker win!!!`)
  }

  return Response.denined(res, `If you are seeing this response, please contact us`)

})

export default handler