const express = require('express')
const { check, validationResult } = require('express-validator')

const Authenticated = require('../middlewares/auth')

const User = require('../models/User')
const Profile = require('../models/Profile')

const router = express.Router()

// Route: GET 'api/profile/current' ; Desc: Get current user's profile ; Access: Private
router.get('/current', Authenticated, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate('user', ['fullname', 'email', 'avatar'])

		if (!profile) {
			return res.status(400).json({ msg: 'This user has no profile yet!' })
		}

		res.json(profile)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('500. SERVER ERROR!')
	}
})

// Route: POST 'api/profile' ; Desc: Create or Update profile ; Access: Private
router.post(
	'/',
	[
		Authenticated,
		[
			check(
				'institution',
				"Missing or Wrong Input! Please enter your institution's name"
			)
				.not()
				.isEmpty(),
			check(
				'institutionType',
				"Missing or Wrong Input! Please enter your institution's type"
			)
				.not()
				.isEmpty(),
			check('institutionType', "Wrong Input! Invalid institution's type").isIn([
				'Governmental Institution',
				'Higher Education Institution',
				'Non-Governmental Organisation',
				'Private Firm',
				'Other',
			]),
			check(
				'role',
				'Missing or Wrong Input! Please enter your role or functionality'
			)
				.not()
				.isEmpty(),
			check(
				'address',
				"Missing or Wrong Input! Please enter your institution's full address"
			)
				.not()
				.isEmpty(),
			check(
				'phone',
				"Missing or Wrong Input! Please enter your institution's phone number"
			)
				.not()
				.isEmpty(),
			check('phone', 'Wrong Input! Invalid phone number').isMobilePhone('any'),
		],
	],
	async (req, res) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array({ onlyFirstError: true }) })
		}

		const {
			institution,
			institutionType,
			role,
			desc,
			address,
			phone,
			website,
		} = req.body

		const fields = {}
		fields.user = req.user.id
		if (institution) fields.institution = institution
		if (institutionType) fields.institutionType = institutionType
		if (role) fields.role = role
		if (desc) fields.desc = desc
		if (address) fields.address = address
		if (phone) fields.phone = phone
		if (website) fields.website = website

		try {
			let profile = await Profile.findOne({
				user: req.user.id,
			}).populate('user', ['fullname', 'email', 'avatar'])

			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: fields },
					{ new: true }
				)

				return res.json(profile)
			}

			profile = new Profile(fields)
			await profile.save()
			res.json(profile)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('500. SERVER ERROR!')
		}
	}
)

// Route: GET 'api/profile' ; Desc: Get all profiles ; Access: Public
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', [
			'fullname',
			'email',
			'avatar',
		])

		res.json(profiles)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('500. SERVER ERROR!')
	}
})

// Route: GET 'api/profile/:userId' ; Desc: Get Profile by user ID ; Access: Public
router.get('/:userId', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.userId,
		}).populate('user', ['fullname', 'email', 'avatar'])

		if (!profile) {
			return res.status(400).json({ msg: 'No profile found!' })
		}

		res.json(profile)
	} catch (err) {
		console.error(err.message)

		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'No profile found!' })
		}

		res.status(500).send('500. SERVER ERROR!')
	}
})

// Route: DELETE 'api/profile' ; Desc: Delete profile & user ; Access: Private
router.delete('/', Authenticated, async (req, res) => {
	try {
		// delete profile
		await Profile.findOneAndDelete({ user: req.user.id })

		// delete user
		await User.findOneAndDelete({ _id: req.user.id })

		res.json({ msg: 'User removed!' })
	} catch (err) {
		console.error(err.message)
		res.status(500).send('500. SERVER ERROR!')
	}
})

module.exports = router
