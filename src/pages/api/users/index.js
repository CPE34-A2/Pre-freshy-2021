import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

const handler = nextConnect()

handler.use(middleware)

handler.get((req, res) => {
  res.status(200).json({})
})

export default handler