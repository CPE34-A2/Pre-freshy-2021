import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/clan'
import * as Response from '@/utils/response'

import Clan from '@/models/clan'
import Battle from '@/models/battle'

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

  const battle = Battle
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
  }

  if (req.query.id == battle.defender) {
    role = 'defender'
  }

  const clan = await Clan
    .findById(req.query.id)
    .select('properties owned_planet_ids')
    .lean()
    .exec()

  if (!clan)
    return Response.denined(res, 'clan not found')

  if (battle.phase04.attacker_vote_won.includes(req.user.id) || battle.phase04.defender_vote_won.includes(req.user.id)) {
    return Response.denined(res, 'You already voted win')
  }

  if (battle.phase04.attacker_vote_lose.includes(req.user.id) || battle.phase04.defender_vote_lose.includes(req.user.id)) {
    return Response.denined(res, 'Cannot vote win. You already vote lose')
  }

  let winner

  if (role == 'attacker') {
    battle.phase04.attacker_vote_won.push(req.user.id)

    if (battle.phase04.attacker_vote_won.length >= battle.confirm_require) {
      winner = 'attacker'
    }

  } else if (role == 'defender') {
    battle.phase04.defender_vote_won.push(req.user.id)
    
    if (battle.phase04.defender_vote_won.length >= battle.confirm_require) {
      winner = 'defender'
    }
  }

  if ((battle.phase04.defender_vote_won.length >= battle.confirm_require) && (battle.phase04.attacker_vote_won.length >= battle.confirm_require)) {
    battle.phase04.status = 'SUS'
    battle.status = 'SUS'
  }

  if ((winner == 'attacker') && (battle.phase04.defender_vote_lose.length >= battle.confirm_require)) {
    battle.phase04.status = 'SUCCESS'
    battle.status = 'ATTACKER_WON'
    battle.current_phase = 0

    const defenderClan = await Clan
      .findById(battle.defender)
      .select('owned_planet_ids position _id')
      .exec()

    if (!defenderClan)
      return Response.denined(res, 'error finding defender clan')

    clan.properties.money += battle.stakes.money
    clan.properties.fuel += battle.stakes.fuel
    clan.owned_planet_ids.push(battle.target_planet_id)
    defenderClan.owned_planet_ids.pull(battle.target_planet_id)
    clan.position = clan._id
    await defenderClan.save()
  }

  if ((winner == 'defender') && (battle.phase04.attacker_vote_lose.length >= battle.confirm_require)) {
    battle.phase04.status = 'SUCCESS'
    battle.status = 'DEFENDER_WON'
    battle.current_phase = 0

    const attackerClan = await Clan
    .findById(battle.attacker)
    .select('owned_planet_ids position _id')
    .exec()

    if (!attackerClan)
      return Response.denined(res, 'error finding attacker clan')

    clan.properties.money += battle.stakes.money
    clan.properties.fuel += battle.stakes.fuel
    clan.owned_planet_ids.push(...battle.stakes.planet_ids)
    battle.stakes.planet_ids.forEach(planet => {
      attackerClan.owned_planet_ids.pull(planet)
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

  const battle = Battle
    .findById(req.body.battle_id)
    .exec()

  if (!battle) {
    return Response.denined(res, 'Battle not found')
  }
  
  if (battle != 'PENDING') {
    return Response.denined(res, 'Battle ended')
  }

  if ((battle.current_phase != 4) && (battle.phase04.status != 'PENDING')) {
    return Response.denined(res, 'Wrong phase')
  }

  if ((battle.phase01.status != 'SUCCESS') && (battle.phase02.status != 'SUCCESS') && (battle.phase03.status != 'SUCCESS')) {
    return Response.denined(res, 'You skipped phase')
  }

  if ((req.query.id != battle.attacker) || (req.query.id != battle.defender)) {
    return Response.denined(res, 'This is not your battle')
  }

  let role

  if (req.query.id == battle.attacker) {
    role = 'attacker'
  }

  if (req.query.id == battle.defender) {
    role = 'defender'
  }

  const clan = await Clan
    .findById(req.query.id)
    .select('properties owned_planet_ids')
    .lean()
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
      .select('owned_planet_ids position _id')
      .exec()

    if (!attackerClan)
      return Response.denined(res, 'error finding attacker clan')

    attackerClan.properties.money += battle.stakes.money
    attackerClan.properties.fuel += battle.stakes.fuel
    attackerClan.owned_planet_ids.push(battle.target_planet_id)
    clan.owned_planet_ids.pull(battle.target_planet_id)
    attackerClan.position = clan._id
    await attackerClan.save()
  }

  if ((loser == 'attacker') && (battle.phase04.defender_vote_win.length >= battle.confirm_require)) {
    battle.phase04.status = 'SUCCESS'
    battle.status = 'DEFENDER_WON'
    battle.current_phase = 0

    const defenderClan = await Clan
    .findById(battle.defender)
    .select('owned_planet_ids position _id')
    .exec()

    if (!defenderClan)
      return Response.denined(res, 'error finding defender clan')

    defenderClan.properties.money += battle.stakes.money
    defenderClan.properties.fuel += battle.stakes.fuel
    defenderClan.owned_planet_ids.push(...battle.stakes.planet_ids)
    battle.stakes.planet_ids.forEach(planet => {
      clan.owned_planet_ids.pull(planet)
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