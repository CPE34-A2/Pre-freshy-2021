import User from '@/models/user'

export async function getUserData(userId) {
  return User
    .findById(userId)
    .select('-password')
    .lean()
    .exec()
}