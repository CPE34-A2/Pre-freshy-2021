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
 *              [1] NORMAL
 *              [2] STOCK
 *              [3] DISATER
 *
 * @body title content and category *required
 *
 *
 * @require Admin authentication
 */

handler.post(async (req, res) => {
  const title = req.body.title
  const content = req.body.content
  const category = parseInt(req.body.category)

  console.log(title, content, category)

  if ((!title) && (!content) && (!category)) {
    return Response.denined(res, 'Please fill in the blanks')
  }

  if (!title) {
    return Response.denined(res, 'Please fill title blanks')
  }
  if (!content) {
    return Response.denined(res, 'Please fill content blanks')
  }
  if (!category) {
    return Response.denined(res, 'Please fill category blanks')
  }

  if (isNaN(category)) {
    return Response.denined(res, 'Please fill blanks of category to number')
  }

  if (category < 1 || category > 3) {
    return Response.denined(res, 'Please enter a valid value.')
  }

  const news = await News.create({
    title: title,
    content: content,
    category: 'CHECKING',
    author: req.user.id
  })

  if (category == 1) {
    news.category = 'NORMAL'
  }

  if (category == 2) {
    news.category = 'STOCK'
  }

  if (category == 3) {
    news.category = 'DISASTER'
  }

  await news.save()

  Response.success(res, {
    title: news.title,
    content: news.content,
    category: news.category,
    author: news.author,
    news_id: news._id
  })

})

/**
 * @method DELETE
 * @endpoint /api/admin/sorayuth
 * @description delete news by admin
 * @description category(number)
 *              [1] NORMAL
 *              [2] STOCK
 *              [3] DISATER
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
    return Response.denined(res, 'News not found')

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