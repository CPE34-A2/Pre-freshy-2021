export function success(res, message) {
  res
    .status(200)
    .json({
      status: true,
      message: message,
      timestamp: new Date()
    })
}

export function denined(res, message) {
  res
    .status(400)
    .json({
      status: false,
      message: message,
      timestamp: new Date()
    })
}