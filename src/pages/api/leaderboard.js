import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'

const handler = nextConnect()

const SORT_MODE = ['point', 'total-planet', 'sec']

handler
	.use(middleware)

/**
 * @method GET
 * @endpoint /api/leaderboard
 * @description Get leaderboard information
 * @param sort option: point, total-planet, sec
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
  let sort = req.query.sort
  
	if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Please login in' })
	}
  
  if (!sort) {
    sort = 'sec'
  }

  sort = sort.toLowerCase()

  if (!(SORT_MODE.includes(sort))) {
    return res.status(401).json({ message: 'Invalid Mode' })
  }

  const clans = await Clan
    .find()
    .populate({
      path: 'owned_planet_ids',
      model: 'Planet',
      select: '_id point'
    })
    .select('-members -properties -fuel_rate -position -leader')
    .sort({ _id: 1 })
    .lean()
    .exec()

  if (sort == SORT_MODE[0]) {
    sortByPoint(clans)
  } else if (sort == SORT_MODE[1]) {
    sortByTotalPlanets(clans)
  }

	res.status(200)
		.json({
			sucesss: !!clans,
			data: clans,
			timestamp: new Date()
		})
})

function sortByPoint(clans) {
  clans.forEach(clan => {
    clan.totalPoint = clan.owned_planet_ids.reduce((total, current) => {
      return total + current.point
    }, 0)
  })
  return clans.sort((a, b) => {
    return b.totalPoint - a.totalPoint
  })
}

function sortByTotalPlanets(clans) {
  return clans.sort((a, b) => {
    return b.owned_planet_ids.length - a.owned_planet_ids.length
  })
}

export default handler