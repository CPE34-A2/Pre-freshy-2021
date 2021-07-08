import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import permission from '@/middlewares/permission/admin'

import * as Response from '@/utils/response'
import News from '@/models/news'


const handler = nextConnect()

handler
  .use(middleware)
  .use(permission)

/**
 * @method POST
 * @endpoint /api/admin/sorayuth
 * @description add news by admin
 * @description category(number) 
 *              [1] DAILY
 *              [2] DISASTER
 * @description affect(number)
 *              [0] NONE
 *              [1] COIN
 *              [2] FUEL
 *              [3] PLANET
 * @body title content and category *required
 *
 *
 * @require Admin authentication
 */

handler.post(async (req, res) => {
  const title = req.body.title
  const content = req.body.content
  const englishContent = req.body.english_content
  const category = parseInt(req.body.category) || 1
  const affect = parseInt(req.body.affect) || 0

  const affectLocale = {
    0: 'NONE',
    1: 'COIN',
    2: 'FUEL',
    3: 'PLANET'
  }[affect]

  const categoryLocale = {
    1: 'DAILY',
    2: 'DISASTER'
  }[category]

  if ((!title) && (!content) && (!englishContent)) {
    return Response.denined(res, 'Please fill in the blanks')
  }

  if (!title) {
    return Response.denined(res, 'Please fill title blanks')
  }
  if (!content) {
    return Response.denined(res, 'Please fill content blanks')
  }

  if (isNaN(category)) {
    return Response.denined(res, 'Please fill blanks of category to number')
  }

  if (category < 1 || category > 2) {
    return Response.denined(res, 'Please enter a valid category value.')
  }

  
  if (affect < 0 || affect > 3) {
    return Response.denined(res, 'Please enter a valid affect value')
  }

  const news = await News.create({
    title: title,
    content: content,
    english_content: englishContent ? englishContent : '',
    author: req.user.id
  })

  news.category = categoryLocale
  news.affect = affectLocale
  await news.save()

  Response.success(res, {
    title: news.title,
    content: news.content,
    category: news.category,
    affect: news.affect,
    author: news.author,
    news_id: news._id
  })

})

/**
 * @method DELETE
 * @endpoint /api/admin/sorayuth
 * @description delete news by admin
 * @description category(number)
 *
 * @body news_id
 *
 * @require Admin authentication
 */

handler.delete(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.news_id)) {
    return Response.denined(res, 'Invalid news id')
  }

  const news = await News
    .findById(req.body.news_id)
    .exec()

  if (!news)
    return Response.denined(res, 'news not found')

  const title_copy = news.title
  const content_copy = news.content
  const author_copy = news.author

  await News
    .findByIdAndDelete(req.body.news_id)
    .exec()

  Response.success(res, {
    title: title_copy,
    content: content_copy,
    category: 'DELETED',
    author: author_copy,
    deleter: req.user.id
  })
})

export default handler