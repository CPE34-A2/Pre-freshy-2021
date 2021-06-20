export default function handler(req, res) {
  const { userId } = req.query
  const filtered = user.filter((e) => e.user_id === userId)

  if (filtered.length > 0) {
    res.status(200).json(filtered)
  } else {
    res.status(404).json({ message: `User with id: ${id} not found.` })
  }
}