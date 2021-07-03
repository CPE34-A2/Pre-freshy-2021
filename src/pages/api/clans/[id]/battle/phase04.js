import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'
import * as Response from '@/utils/response'

import Clan from '@/models/clan'
import Battle from '@/models/battle'
import Planet from '@/models/planet'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

/**
 * @method Patch
 * @endpoint /api/clans/:id/battle/phase04
 * @description confirm who wins in the battle at phase04
 * 
 * @body battle_id
 * 
 * @require User authentication / Clan membership
 */
handler.patch(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.battle_id)) {
    return Response.denined(res, 'Invalid battle id')
  }

  const battle = await Battle
    .findById(req.body.battle_id)
    .exec()

  if (!battle) {
    return Response.denined(res, 'Battle not found')
  }
   
  if (battle.status != 'PENDING') {
    return Response.denined(res, 'Battle ended')
  }

  if ((battle.current_phase != 4) && (battle.phase04.status != 'PENDING')) {
    return Response.denined(res, 'Wrong phase')
  }

  if ((battle.phase01.status != 'SUCCESS') && (battle.phase02.status != 'SUCCESS') && (battle.phase03.status != 'SUCCESS')) {
    return Response.denined(res, 'You skipped phase')
  }

  if ((req.query.id != battle.attacker) && (req.query.id != battle.defender)) {
    return Response.denined(res, 'This is not your battle')
  }

  let role

  if (req.query.id == battle.attacker) {
    role = 'attacker'
    if ((battle.phase04.attacker_vote_lose.length >= battle.confirm_require) || (battle.phase04.attacker_vote_win.length >= battle.confirm_require)) {
      return Response.denined(res, 'Your team already voted enough')
    }
  }

  if (req.query.id == battle.defender) {
    role = 'defender'
    if ((battle.phase04.defender_vote_lose.length >= battle.confirm_require) || (battle.phase04.defender_vote_win.length >= battle.confirm_require)) {
      return Response.denined(res, 'Your team already voted enough')
    }
  }

  const clan = await Clan
    .findById(req.query.id)
    .select('properties owned_planet_ids')
    .exec()

  if (!clan)
    return Response.denined(res, 'clan not found')
    
  if (battle.phase04.attacker_vote_win.includes(req.user.id) || battle.phase04.defender_vote_win.includes(req.user.id)) {
    return Response.denined(res, 'You already voted win')
  }
   
  if (battle.phase04.attacker_vote_lose.includes(req.user.id) || battle.phase04.defender_vote_lose.includes(req.user.id)) {
    return Response.denined(res, 'Cannot vote win. You already vote lose')
  }
  
  let winner

  if (role == 'attacker') {
    battle.phase04.attacker_vote_win.push(req.user.id)

    if (battle.phase04.attacker_vote_win.length >= battle.confirm_require) {
      winner = 'attacker'
    }

  } else if (role == 'defender') {
    battle.phase04.defender_vote_win.push(req.user.id)
    
    if (battle.phase04.defender_vote_win.length >= battle.confirm_require) {
      winner = 'defender'
    }
  }

  if ((battle.phase04.defender_vote_win.length >= battle.confirm_require) && (battle.phase04.attacker_vote_win.length >= battle.confirm_require)) {
    battle.phase04.status = 'SUS'
    battle.status = 'SUS'
  }

  if ((winner == 'attacker') && (battle.phase04.defender_vote_lose.length >= battle.confirm_require)) {
    battle.phase04.status = 'SUCCESS'
    battle.status = 'ATTACKER_WON'
    battle.current_phase = 0

    const defenderClan = await Clan
      .findById(battle.defender)
      .select('owned_planet_ids position _id properties')
      .exec()

    if (!defenderClan)
      return Response.denined(res, 'error finding defender clan')

    const targetPlanet = await Planet
      .findById(battle.target_planet_id)
      .select('owner')
      .exec()

    if (!targetPlanet)
      return Response.denined(res, 'error finding target planet')

    clan.properties.money += battle.stakes.money
    clan.properties.fuel += battle.stakes.fuel
    clan.owned_planet_ids.push(battle.target_planet_id)
    defenderClan.owned_planet_ids.pull(battle.target_planet_id)
    clan.position = clan._id
    targetPlanet.owner = clan._id
    await targetPlanet.save()
    await defenderClan.save()
  }

  if ((winner == 'defender') && (battle.phase04.attacker_vote_lose.length >= battle.confirm_require)) {
    battle.phase04.status = 'SUCCESS'
    battle.status = 'DEFENDER_WON'
    battle.current_phase = 0

    const attackerClan = await Clan
    .findById(battle.attacker)
    .select('owned_planet_ids position _id properties')
    .exec()

    if (!attackerClan)
      return Response.denined(res, 'error finding attacker clan')

    const stakePlanets = await Planet
      .find({ _id: { $in: [...battle.stakes.planet_ids]}})
      .select('owner')
      .exec()

    if (!stakePlanets) 
      return Response.denined(res, 'error finding stake planets')

    clan.properties.money += battle.stakes.money
    clan.properties.fuel += battle.stakes.fuel
    clan.owned_planet_ids.push(...battle.stakes.planet_ids)
    battle.stakes.planet_ids.forEach(planet => {
      attackerClan.owned_planet_ids.pull(planet)
    })
    stakePlanets.forEach(planet => {
      planet.owner = clan._id
      planet.save()
    })
    attackerClan.position = attackerClan._id
    await attackerClan.save()
  }
  await clan.save()
  await battle.save()

  Response.success(res, {
    battle: battle
  })
})

/**
 * @method Delete
 * @endpoint /api/clans/:id/battle/phase04
 * @description confirm who loses in the battle at phase04
 * 
 * @body battle_id
 * 
 * @require User authentication / Clan membership
 */
handler.delete(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.battle_id)) {
    return Response.denined(res, 'Invalid battle id')
  }

  const battle = await Battle
    .findById(req.body.battle_id)
    .exec()

  if (!battle) {
    return Response.denined(res, 'Battle not found')
  }
  
  if (battle.status != 'PENDING') {
    return Response.denined(res, 'Battle ended')
  }

  if ((battle.current_phase != 4) && (battle.phase04.status != 'PENDING')) {
    return Response.denined(res, 'Wrong phase')
  }

  if ((battle.phase01.status != 'SUCCESS') && (battle.phase02.status != 'SUCCESS') && (battle.phase03.status != 'SUCCESS')) {
    return Response.denined(res, 'You skipped phase')
  }

  if ((req.query.id != battle.attacker) && (req.query.id != battle.defender)) {
    return Response.denined(res, 'This is not your battle')
  }

  let role

  if (req.query.id == battle.attacker) {
    role = 'attacker'
    if ((battle.phase04.attacker_vote_lose.length >= battle.confirm_require) || (battle.phase04.attacker_vote_win.length >= battle.confirm_require)) {
      return Response.denined(res, 'Your team already voted enough')
    }
  }

  if (req.query.id == battle.defender) {
    role = 'defender'
    if ((battle.phase04.defender_vote_lose.length >= battle.confirm_require) || (battle.phase04.defender_vote_win.length >= battle.confirm_require)) {
      return Response.denined(res, 'Your team already voted enough')
    }
  }

  const clan = await Clan
    .findById(req.query.id)
    .select('properties owned_planet_ids')
    .exec()

  if (!clan)
    return Response.denined(res, 'clan not found')

  if (battle.phase04.attacker_vote_lose.includes(req.user.id) || battle.phase04.defender_vote_lose.includes(req.user.id)) {
    return Response.denined(res, 'You already voted lose')
  }

  if (battle.phase04.attacker_vote_win.includes(req.user.id) || battle.phase04.defender_vote_win.includes(req.user.id)) {
    return Response.denined(res, 'Cannot vote lose. You already vote win')
  }

  let loser

  if (role == 'attacker') {
    battle.phase04.attacker_vote_lose.push(req.user.id)

    if (battle.phase04.attacker_vote_lose.length >= battle.confirm_require) {
      loser = 'attacker'
    }

  } else if (role == 'defender') {
    battle.phase04.defender_vote_lose.push(req.user.id)
    
    if (battle.phase04.defender_vote_lose.length >= battle.confirm_require) {
      loser = 'defender'
    }
  }

  if ((battle.phase04.defender_vote_lose.length >= battle.confirm_require) && (battle.phase04.attacker_vote_lose.length >= battle.confirm_require)) {
    battle.phase04.status = 'SUS'
    battle.status = 'SUS'
  }

  if ((loser == 'defender') && (battle.phase04.attacker_vote_win.length >= battle.confirm_require)) {
    battle.phase04.status = 'SUCCESS'
    battle.status = 'ATTACKER_WON'
    battle.current_phase = 0

    const attackerClan = await Clan
      .findById(battle.attacker)
      .select('owned_planet_ids position _id properties')
      .exec()

    if (!attackerClan)
      return Response.denined(res, 'error finding attacker clan')

    const targetPlanet = await Planet
      .findById(battle.target_planet_id)
      .select('owner')
      .exec()

    if (!targetPlanet)
      return Response.denined(res, 'error finding target planet')

    attackerClan.properties.money += battle.stakes.money
    attackerClan.properties.fuel += battle.stakes.fuel
    attackerClan.owned_planet_ids.push(battle.target_planet_id)
    clan.owned_planet_ids.pull(battle.target_planet_id)
    attackerClan.position = attackerClan._id
    targetPlanet.owner = attackerClan._id
    await attackerClan.save()
    await targetPlanet.save()
  }

  if ((loser == 'attacker') && (battle.phase04.defender_vote_win.length >= battle.confirm_require)) {
    battle.phase04.status = 'SUCCESS'
    battle.status = 'DEFENDER_WON'
    battle.current_phase = 0

    const defenderClan = await Clan
    .findById(battle.defender)
    .select('owned_planet_ids position _id properties')
    .exec()

    if (!defenderClan)
      return Response.denined(res, 'error finding defender clan')

    const stakePlanets = await Planet
      .find({ _id: { $in: [...battle.stakes.planet_ids]}})
      .select('owner')
      .exec()

    if (!stakePlanets) 
      return Response.denined(res, 'error finding stake planets')

    defenderClan.properties.money += battle.stakes.money
    defenderClan.properties.fuel += battle.stakes.fuel
    defenderClan.owned_planet_ids.push(...battle.stakes.planet_ids)
    battle.stakes.planet_ids.forEach(planet => {
      clan.owned_planet_ids.pull(planet)
    })
    stakePlanets.forEach(planet => {
      planet.owner = defenderClan._id
      planet.save()
    })
    clan.position = clan._id
    await defenderClan.save()
  }
  await clan.save()
  await battle.save()

  Response.success(res, {
    battle: battle
  })
})

export default handler