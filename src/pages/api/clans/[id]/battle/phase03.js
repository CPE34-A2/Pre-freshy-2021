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
 * @method Post
 * @endpoint /api/clans/:id/battle/phase03
 * @description add game to battle phase03
 * 
 * @body game
 * 
 * @require User authentication / Clan leadership
 */
handler.post(async (req, res) => {
  const game = req.body.game
  
  if (!game) {
    return Response.denined(res, 'No input found')
  }

  if (!mongoose.Types.ObjectId.isValid(req.body.battle_id)) {
    return Response.denined(res, 'Invalid battle id')
  }

  const battle = await Battle
    .findById(req.body.battle_id)
    .select('-phase04 -stakes -confirm_require')
    .exec()

  if (!battle) {
    return Response.denined(res, 'Battle not found')
  }

  if (battle.status != 'PENDING') {
    return Response.denined(res, 'Battle ended')
  }
  
  if ((battle.current_phase != 3) && (battle.phase03.status != 'PENDING')) {
    return Response.denined(res, 'Wrong phase')
  }

  if ((battle.phase01.status != 'SUCCESS') && (battle.phase02.status != 'SUCCESS')) {
    return Response.denined(res, 'You skipped phase')
  }

  if ((req.query.id != battle.attacker) && (req.query.id != battle.defender)) {
    return Response.denined(res, 'This is not your battle')
  }

  const clan = await Clan
    .findById(req.query.id)
    .select('leader')
    .lean()
    .exec()

  if (!clan)
    return Response.denined(res, 'clan not found')

  if (clan.leader != req.user.id) {
    return Response.denined(res, 'You are not clan leader')
  }

  battle.game = game
  battle.phase03.confirmer = req.user.id
  battle.phase03.status = 'SUCCESS'
  
  battle.current_phase = 4
  battle.phase04.status = 'PENDING'

  await battle.save()

  Response.success(res, {
    battle: battle
  })
})

export default handler