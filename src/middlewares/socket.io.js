import { Server } from 'socket.io'

export default function socketMiddleware(req, res, next) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)

    io.on('connection', (socket) => {
      // console.log('User connected')

      socket.on('disconnect', () => {
        // console.log('User disconnected')
      })
    })

    res.socket.server.io = io
  }

  return next()
}