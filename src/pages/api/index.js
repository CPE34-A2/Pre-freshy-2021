import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

const handler = nextConnect()

handler.use(middleware)

handler.get((req, res) => {
  res.status(200).json({
    message: 'prefreshy-2021-api',
    version: '1.0.0'
  })
})

export default handler