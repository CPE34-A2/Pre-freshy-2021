export default function handler(req, res) {
  res.status(200).json({
    message: 'prefreshy-2021-api',
    version: '1.0.0'
  })
}