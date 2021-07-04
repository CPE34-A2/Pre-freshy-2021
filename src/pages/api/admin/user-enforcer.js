import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/admin'
import bcrypt from 'bcryptjs'

import * as Response from '@/utils/response'
import User from '@/models/user'
import Clan from '@/models/clan'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

/**
 * @method GET
 * @endpoint /api/admin/user-enforcer
 * @description control the user's data like a piece of cake.
 * @description positive value of 'money' to add/ negative 'money' to remove
 * 
 * @require Admin authentication
 * 
 * @param user_id required
 * @param display_name, optional
 * @param clan_id optional
 * @param money optional
 * @param password optional
 */
handler.get(async (req, res) => {
  const userId = req.query.user_id
  const newDisplayName = req.query.display_name
  const newClanId = parseInt(req.query.clan_id)
  const money = parseInt(req.query.money)
  const password = req.query.password

  const user = await User
    .findById(userId)
    .select()
    .exec()

  if (!user)
    return Response.denined(res, 'user not found!!!')

  if ((!newDisplayName) && (!newClanId) && (!money) && (!password))
    return Response.denined(res, 'no input found')

  // change displayName
  if (newDisplayName !== '') {
    user.display_name = newDisplayName
  }

  // add or remove money
  if (!isNaN(money)) {
    if (user.money + money < 0)
      return Response.denined(res, 'You are so heartless. Why would you like to make someone\'s money go negative?')

    user.money += money
  }

  // change password
  if (!!password) {
    user.password = await bcrypt.hash(password, 10)
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

    const oldClan = await Clan
      .findById(user.clan_id)
      .select()
      .exec()

    if (oldClan) {
      if (oldClan.leader == userId) {
        return Response.denined(res, `This user is currently the leader of clan ${oldClan._id}. Change leader before change clan`)
      }

      oldClan.members.pull(userId)
      await oldClan.save()
    }

    user.clan_id = newClanId
    await newClan.save()
  }

  await user.save()

  if (money) {
    req.socket.server.io.emit('set.user.money', user._id, user.money)
  }

  return Response.success(res, {
    userId: userId,
    newDisplayName: newDisplayName ? newDisplayName : 'not changed',
    newClanId: newClanId ? newClanId : 'not changed',
    money: money ? (money > 0 ? 'add amount: ' + money : 'remove amount: ' + (-money)) : 'not changed',
    password: password ? password : 'not changed'
  })

})

export default handler