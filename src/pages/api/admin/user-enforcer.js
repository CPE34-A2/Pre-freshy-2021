import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/admin'

import * as Response from '@/utils/response'
import User from '@/models/user'
import Clan from '@/models/clan'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

/**
 * @method POST
 * @endpoint /api/admin/user-enforcer
 * @description control the user's data like a piece of cake.
 * @description positive value of 'money' to add/ negative 'money' to remove
 * 
 * @require Admin authentication
 * 
 * @body user_id *required
 * @body display_name, clan_id, money *optional
 */
handler.post(async (req, res) => {
  const userId = req.body.user_id
  const newDisplayName = req.body.display_name
  const newClanId = parseInt(req.body.clan_id)
  const money =  parseInt(req.body.money)

  const user = await User
    .findById(userId)
    .select()
    .exec()

  if (!user)
    return Response.denined(res, 'user not found!!!')

  // change displayName
  if (newDisplayName !== '') {
    user.display_name = newDisplayName
    await user.save()
  }

  // change clanId
  if (!isNaN(newClanId)) {
    const newClan = await Clan
      .findById(newClanId)
      .select()
      .exec()

    if (!newClan)
      return Response.denined(res, 'clan not found!!!')
    
    if (newClan.members.includes(userId))
      return Response.denined(res, 'that user already in that clan!!!')

    newClan.members.push(userId)
    await newClan.save()

    const oldClan = await Clan
      .findById(user.clan_id)
      .select()
      .exec()

    if (oldClan) {
      oldClan.members.pull(userId)
      await oldClan.save()
    }

    user.clan_id = newClanId
    await user.save()
  }

  // add or remove money
  if (!isNaN(money)) {
    if (user.properties.money + money < 0)
      return Response.denined(res, 'You are so heartless. Why would you like to make someone\'s money go negative?')

    user.properties.money += money 
  }

  return Response.success(res, {
    userId: userId,
    newDisplayName: newDisplayName ? newDisplayName : 'not changed',
    newClanId: newClanId ? newClanId : 'not changed',
    money: money ? (money > 0 ? 'add amount: ' + money : 'remove amount: ' + (-money)) : 'not changed'
  })

})

export default handler