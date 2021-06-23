import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method All
 * @endpoint /api
 * @description Ping! pong!
 */
handler.all((req, res) => {
  res.status(200).json({
    success: true,
    message: 'prefreshy-2021-api',
    version: process.env.npm_package_version
  })
})

export default handler