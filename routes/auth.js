const express = require('express')
const router = express.Router()
const { sign } = require('jsonwebtoken')
const config = require('config')
const { compare } = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const Authenticated = require('../middlewares/auth')

const User = require('../models/User')

// Route: GET 'api/auth' ; Desc: Get The Authenticated User ; Access: Private
router.get('/', Authenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('500. SERVER ERROR!')
  }
})

// Route: POST 'api/auth' ; Desc: Sign In User ; Access: Public
router.post(
  '/',
  [
    check(
      'email',
      'Missing or Wrong Input! Not a valid email address'
    ).isEmail(),
    check('password', 'Missing or Wrong Input! Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      var user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid credentials!' }],
        })
      }

      const pwMatch = await compare(password, user.password)
      if (!pwMatch) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid credentials!' }],
        })
      }

      const payload = {
        user: {
          id: user.id,
        },
      }

      sign(
        payload,
        config.get('JWT_SECRET'),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err

          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('500. SERVER ERROR!')
    }
  }
)

module.exports = router
