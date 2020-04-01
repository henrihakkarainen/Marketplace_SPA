module.exports = async (userConfig) => {
  const User = require('../models/user')
  const admin = await User.findOne({ role: 'admin' })

  if (admin) return

  const user = new User(userConfig)
  user.role = 'admin'
  await user.save()
  return
}