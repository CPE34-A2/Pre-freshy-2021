import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/user'

import * as Response from '@/utils/response'

import User from '@/models/user'
import Clan from '@/models/clan'
import Transaction from '@/models/transaction'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

handler.post(async (req, res) => {
  const amount = parseInt(req.body.amount)

  if (isNaN(amount))
    return Response.denined(res, 'amount is not a number')

  if (amount <= 0)
    return Response.denined(res, 'amount must be greater than 0')
  
  const user = await User
    .findById(req.query.id)
    .select('_id clan_id properties.money')
    .exec()

  if (user.properties.money < amount)
    return Response.denined(res, 'money is not enough')

  const clan = await Clan
    .findById(user.clan_id)
    .select('properties.money')
    .exec()

  user.properties.money -= amount
  await user.save()

  clan.properties.money += amount
  await clan.save()

  await Transaction.create({
    owner: {
      id: user._id,
      type: 'user'
    },
    receiver: {
      id: user.clan_id,
      type: 'clan'
    },
    status: 'SUCCESS',
    item: {
      money: amount
    }
  })

  Response.success(res, { 
    user_money: user.properties.money,
    clan_money: clan.properties.money
  })
})

export default handler