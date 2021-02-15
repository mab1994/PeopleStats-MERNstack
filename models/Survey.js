const mongoose = require('mongoose')

const SurveySchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	name: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
	target: [
		{
			type: String,
			required: true,
		},
	],
	age: {
		type: Boolean,
		required: true,
		default: false,
	},
	minAge: {
		type: Number,
		required: true,
		default: 0,
	},
	maxAge: {
		type: Number,
		required: true,
		default: 0,
	},
	sex: {
		type: String,
		required: true,
	},
	education: [
		{
			type: String,
		},
	],
	questions: [
		{
			title: {
				type: String,
				required: true,
			},
			desc: {
				type: String,
			},
			questType: {
				type: String,
				required: true,
				enum: [
					'Text',
					'Number',
					'Y/N Question',
					'Multiple Choice',
					'Checklist',
					'Interval',
					'Date',
					'Time',
					'File',
				],
			},
			isObligatory: {
				type: Boolean,
				required: true,
				default: false,
			},
			file: {
				type: String,
			},
			choices: [mongoose.Schema.Types.Mixed],
			answers: [
				{
					answer: {
						type: mongoose.Schema.Types.Mixed,
					},
				},
			],
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = Survey = mongoose.model('survey', SurveySchema)
