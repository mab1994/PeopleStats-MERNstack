const express = require('express')
const { check, validationResult } = require('express-validator')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const Authenticated = require('../middlewares/auth')

const Survey = require('../models/Survey')
const User = require('../models/User')

const router = express.Router()

// inialize file uploading via multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},

	filename: (req, file, cb) => {
		cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname))
	},
})

const fileFilter = (req, file, cb) => {
	const allowedFileTypes = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'video/mp4',
		'application/pdf',
	]
	if (allowedFileTypes.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

let upload = multer({ storage, fileFilter })

// ROUTES
// Route: POST 'api/surveys' ; Desc: Create new survey ; Access: Private
router.post(
	'/',
	[
		Authenticated,
		[
			check(
				'name',
				'Missing or Wrong Input! Please include a name for the survey'
			)
				.not()
				.isEmpty(),
			check(
				'desc',
				'Missing or Wrong Input! Please include a description for the survey'
			)
				.not()
				.isEmpty(),
			check(
				'target',
				'Missing or Wrong Input! Please precise the target of the survey'
			)
				.not()
				.isEmpty(),
			check(
				'sex',
				'Missing or Wrong Input! Please precise whether the target has specific gender'
			)
				.not()
				.isEmpty(),
			check(
				'sex',
				'Missing or Wrong Input! Please precise whether the target has specific gender'
			).isIn([
				'Not Important',
				'Female-Oriented',
				'Male-Oriented',
				'Other Gender Oriented',
			]),
		],
	],
	async (req, res) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array({ onlyFirstError: true }) })
		}

		const user = await User.findById(req.user.id).select('-password')

		const { name, desc, target, age, minAge, maxAge, sex, education } = req.body

		try {
			const newSurvey = new Survey({
				user: req.user.id,
				name,
				desc,
				target,
				age,
				minAge,
				maxAge,
				sex,
				education,
			})

			const survey = await newSurvey.save()
			res.json(survey)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('500. SERVER ERROR!')
		}
	}
)

// Route: GET 'api/surveys' ; Desc: Get All surveys ; Access: Public
router.get('/', async (req, res) => {
	try {
		const surveys = await Survey.find()
			.sort({ createdAt: -1 })
			.populate('user', ['fullname', 'email', 'avatar'])

		res.json(surveys)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('500. SERVER ERROR!')
	}
})

// Route: GET 'api/surveys/:id' ; Desc: Get surveys by Id ; Access: Public
router.get('/:id', async (req, res) => {
	try {
		const survey = await Survey.findById(req.params.id).populate('user', [
			'fullname',
			'email',
			'avatar',
		])

		if (!survey) {
			return res.status(400).json({ msg: 'Cannot found this survey!' })
		}

		res.json(survey)
	} catch (err) {
		console.error(err.message)

		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Cannot found this survey!' })
		}

		res.status(500).send('500. SERVER ERROR!')
	}
})

// Route: GET 'api/surveys/user/me' ; Desc: Get Surveys of Current User ; Access: Private
router.get('/user/me', Authenticated, async (req, res) => {
	try {
		const surveys = await Survey.find({ user: req.user.id })
			.sort({ createdAt: -1 })
			.populate('user', ['fullname', 'email', 'avatar'])

		if (surveys.length === 0) {
			return res
				.status(400)
				.json({ msg: "You don't have surveys yet! Start creating now" })
		}

		res.json(surveys)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('500. SERVER ERROR!')
	}
})

// Route: GET 'api/surveys/user/:userId' ; Desc: Get surveys by User Id ; Access: Public
router.get('/user/:userId', async (req, res) => {
	try {
		let surveys = await Survey.find({ user: req.params.userId })
			.sort({ createdAt: -1 })
			.populate('user', ['fullname', 'email', 'avatar'])

		if (surveys.length === 0) {
			return res.status(400).json({ msg: 'Cannot find surveys!' })
		}

		res.json(surveys)
	} catch (err) {
		console.error(err.message)

		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Cannot find surveys!' })
		}

		res.status(500).send('500. SERVER ERROR!')
	}
})

// Route: PUT 'api/surveys/:id' ; Desc: Update survey data ; Access: Private
router.put('/:id', Authenticated, async (req, res) => {
	const { name, desc, target, age, minAge, maxAge, sex, education } = req.body

	const fields = {}
	if (name) fields.name = name
	if (desc) fields.desc = desc
	if (age) fields.age = age
	if (minAge) fields.minAge = minAge
	if (maxAge) fields.maxAge = maxAge
	if (sex) fields.sex = sex
	if (education) fields.education = education
	if (target) {
		fields.target = target
	}

	try {
		let survey = await Survey.findById(req.params.id)

		if (survey.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not Authorized!' })
		}

		survey = await Survey.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set: fields },
			{ new: true }
		)

		await survey.save()
		res.json(survey)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('500. SERVER ERROR!')
	}
})

// Route: DELETE 'api/surveys/:id' ; Desc: Delete Survey ; Access: Private
router.delete('/:id', Authenticated, async (req, res) => {
	try {
		let survey = await Survey.findById(req.params.id)

		if (survey.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not Authorized!' })
		}

		survey = await Survey.findByIdAndDelete(req.params.id)
		res.json({ msg: 'Survey Removed!' })
	} catch (err) {
		console.error(err.message)
		res.status(500).send('500. SERVER ERROR!')
	}
})

// Route: POST 'api/surveys/:id'; Desc: Add Question; Access: Private
router.post(
	'/:id',
	[
		Authenticated,
		upload.single('file'),
		[
			check('title', 'Missing or Wrong Input! Please include the question')
				.not()
				.isEmpty(),
			check(
				'questType',
				'Missing or Wrong Input! Please include the answer type'
			)
				.not()
				.isEmpty(),
			check(
				'questType',
				'Wrong Input! Please include a valid answer type'
			).isIn([
				'Text',
				'Number',
				'Y/N Question',
				'Multiple Choice',
				'Checklist',
				'File',
				'Interval',
				'Date',
				'Time',
			]),
		],
	],
	async (req, res) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array({ onlyFirstError: true }) })
		}

		const { title, desc, questType, isObligatory, choices } = req.body

		const newQuest = {
			title,
			desc,
			questType,
			isObligatory,
			file: req.filename,
			choices,
		}

		if (newQuest.questType === 'Y/N Question') {
			newQuest.choices = ['Yes', 'No']
		} else {
			newQuest.choices = []
		}

		try {
			const survey = await Survey.findById(req.params.id)

			if (survey.user.toString() !== req.user.id) {
				return res.status(401).json({ msg: 'Not Authorized!' })
			}

			survey.questions.push(newQuest)

			await survey.save()

			res.json(survey)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('500. SERVER ERROR!')
		}
	}
)

// Route: DELETE 'api/surveys/questions/:sId/:qId'; Desc: Remove Question; Access: Private
router.delete('/questions/:sId/:qId', Authenticated, async (req, res) => {
	try {
		const survey = await Survey.findById(req.params.sId)

		if (!survey) {
			return res.status(404).json({ msg: 'Cannot find the survey!' })
		}

		const question = survey.questions.find((q) => q.id === req.params.qId)

		if (!question) {
			return res.status(404).json({ msg: 'Cannot find the question!' })
		}

		if (survey.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not Authorized!' })
		}

		const index = survey.questions
			.map((question) => question._id.toString())
			.indexOf(req.params.qId)
		survey.questions.splice(index, 1)

		await survey.save()

		res.json(survey)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('500. SERVER ERROR!')
	}
})

// Route: POST 'api/surveys/questions/answers/:sId/:qId'; Desc: Add Answer; Access: Public
router.post('/questions/answers/:sId/:qId', async (req, res) => {
	const { answer } = req.body

	let newAnswer = { answer }
	try {
		const survey = await Survey.findById(req.params.sId)

		if (!survey) {
			return res.status(404).json({ msg: 'Cannot find the survey!' })
		}

		const question = survey.questions.find((q) => q.id === req.params.qId)

		if (!question) {
			return res.status(404).json({ msg: 'Cannot find the question!' })
		}

		if (newAnswer.answer === '' && question.isObligatory === true) {
			console.log(newAnswer)
			return res.status(400).json({ msg: 'Required Answer!' })
		}

		question.answers.unshift(newAnswer)

		await survey.save()
		res.json(survey)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('500. SERVER ERROR!')
	}
})

// Route: GET 'api/surveys/questions/answers/:sId/:qId'; Desc: Get All Answers; Access: Private
router.get('/questions/answers/:sId/:qId', Authenticated, async (req, res) => {
	try {
		const survey = await Survey.findById(req.params.sId)

		if (!survey) {
			return res.status(404).json({ msg: 'Cannot find the survey!' })
		}

		if (survey.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not Authorized!' })
		}

		const question = survey.questions.find((q) => q.id === req.params.qId)

		if (!question) {
			return res.status(404).json({ msg: 'Cannot find the question!' })
		}

		res.json(question.answers)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('500. SERVER ERROR!')
	}
})

// Route: GET 'api/surveys/questions/answers/:sId/:qId/:aId'; Desc: Get Answer By Id; Access: Private
router.get(
	'/questions/answers/:sId/:qId/:aId',
	Authenticated,
	async (req, res) => {
		try {
			const survey = await Survey.findById(req.params.sId)

			if (!survey) {
				return res.status(404).json({ msg: 'Cannot find the survey!' })
			}

			if (survey.user.toString() !== req.user.id) {
				return res.status(401).json({ msg: 'Not Authorized!' })
			}

			const question = survey.questions.find((q) => q.id === req.params.qId)

			if (!question) {
				return res.status(404).json({ msg: 'Cannot find the question!' })
			}

			const answer = question.answers.find((a) => a.id === req.params.aId)

			if (!answer) {
				return res.status(404).json({ msg: 'Cannot find the answer!' })
			}

			res.json(answer)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('500. SERVER ERROR!')
		}
	}
)

module.exports = router
