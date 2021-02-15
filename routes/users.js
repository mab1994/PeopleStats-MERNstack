const express = require('express')
const gravatar = require('gravatar')
const { sign } = require('jsonwebtoken')
const config = require('config')
const { genSalt, hash } = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const router = express.Router()

const User = require('../models/User')

// Route: POST 'api/users' ; Desc: Sign up new user ; Access: Public
router.post(
  '/',
  [
    check('fullname', 'Missing or Wrong Input! Please enter your full name')
      .not()
      .isEmpty(),
    check(
      'email',
      'Missing or Wrong Input! Not a valid email address'
    ).isEmail(),
    check('password', 'Required Field! Please enter a password')
      .not()
      .isEmpty(),
    check(
      'password',
      "Wrong Input! Password's length must be at least 10 characters"
    ).isLength({ min: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array({ onlyFirstError: true }) })
    }

    const { fullname, email, password } = req.body

    try {
      var user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({
          errors: [{ msg: 'Already existing user with these credentials!' }],
        })
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })

      user = new User({
        fullname,
        email,
        password,
        avatar,
      })

      const salt = await genSalt(10)
      user.password = await hash(password, salt)

      await user.save()

      const payload = {
        user: {
          id: user.id,
        },
      }

      sign(payload, config.get('JWT_SECRET'), { expiresIn: 3600000 }, (err, token) => {
        if (err) throw err
        
        res.json({ token })
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).send('500. SERVER ERROR!')
    }
  }
)

module.exports = router
