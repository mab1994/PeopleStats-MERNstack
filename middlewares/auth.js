const { verify } = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token')

  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized! Please authenticate first...' })
  }

  try {
    const decodeToken = verify(token, config.get('JWT_SECRET'))
    req.user = decodeToken.user
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Invalid Token' })
  }
}
