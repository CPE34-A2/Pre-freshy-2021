import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/admin'

import * as Response from '@/utils/response'

import Planet from '@/models/planet'

const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

/**
* @method POST
* @endpoint /api/admin/eternal
* @description control planets' quests and points with the eternal power
* @description specify quest and planet id to change the planet quest 
* @description specify mode "D", "C", "LV" to alter the reality and change the planet points
* 
* @body 1. mode / 2. quest,planet_id *choose only one option
* 
* @require Admin authentication
*/
handler.post(async (req, res) => {
  const quest = req.body.quest
  let mode = req.body.mode
  const planetId = parseInt(req.body.planet_id)

  if (mode) {
    mode = mode.toUpperCase()
  }

  if ((!mode) && (!quest)) {
    return Response.denined(res, 'no input found')
  }

  if (isNaN(planetId) && (!mode)) {
    return Response.denined(res, 'invalid planet id ')
  }

  if ((!!mode) && ((!!quest) || (!!planetId))) {
    return Response.denined(res, 'cant input quest and mode simultaneously')
  }

  let planet

  let affectedPlanets = []

  if ((!mode) && (!!quest)) {
    planet = await Planet
      .findById(planetId)
      .exec()

    if (!planet)
      return Response.denined(res, 'planet not found')

    planet.quest = quest
    affectedPlanets.push(planet)
    await planet.save()
  }

  if ((!!mode) && (!quest)) {
    if (mode !== 'D' && mode !== 'C' && mode !== 'LV') {
      return Response.denined(res, 'invalid mode')
    }

    let planetArray

    if (mode === 'D') {
      planetArray = await Planet
        .find({ tier: 'D' })
        .select('point owner _id')

      planetArray.forEach((planet) => {
        if (planet.owner != 0) {
          planet.point -= 1
          affectedPlanets.push(planet)
        }
      })
    }

    if (mode === 'C') {
      planetArray = await Planet
        .find({ tier: 'C' })
        .select('point owner _id')

      planetArray.forEach((planet) => {
        if (planet.owner != 0) {
          planet.point -= 2
          affectedPlanets.push(planet)
        }
      })
    }

    if (mode === 'LV') {
      planetArray = await Planet
        .find({ owner: { $ne: 0 } })
        .select('point owner _id')
        .sort({ point: 1 })
        .exec()

      for (let i = 1; i <= 7; i++) {
        let min = 100
        planetArray.forEach((planet) => {
          if (planet.owner == i && planet.point <= min) {
            min = planet.point
            planet.point *= 2
            affectedPlanets.push(planet)
          }
        })
      }
    }
    affectedPlanets.forEach((planet) => {
      planet.save()
    })
  }

  Response.success(res, {
    planet: !!planet ? req.body.planet_id : 0,
    quest: !!planet ? quest : '',
    mode: affectedPlanets.length != 0 ? mode : '',
    affectedPlanets: affectedPlanets.length != 0 ? affectedPlanets : []
  })

})

export default handler