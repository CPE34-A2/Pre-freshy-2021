import { user } from '../../../../database.js'

export default function personHandler({ query: { userId } }, res) {
    const filtered = user.filter((p) => p.user_id === userId)

    if (filtered.length > 0) {
        res.status(200).json(filtered[0])
    } else {
        res.status(404).json({ message: `User with id: ${id} not found.` })
    }
}