require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mailgun = require('mailgun-js')
const bodyParser = require('body-parser')
const {check, validationResult} = require("express-validator")

// Initializing Express Application
const app = express()

// Making express aware of project-wide middleware
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const indexRoute = express.Router()

const requestValidation = [
	check("email", "A valid email is required".isEmail().normalizeEmail(),
	check ('name', 'A name is required to send an email').not().isEmpty().trim().escape(),
	check ('subject').optional().trim().escape(),
	check('message', 'A message is required to send email.').not().isEmpty().trim().escape().isLength({max:2000}))
]

indexRoute.route('/apis')
	.get((request, response) => {
	return response.json("Testing A")
	})
	.post( requestValidation, (request, response) => {
		const domain = process.env.MAILGUN_DOMAIN
		const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: domain});

		const {email, subject, name, message} = request.body

		const mailgunData = {
			to: process.env.MAIL_RECIPIENT,
			from: `Mailgun Sandbox <postmaster@${domain}>`,
			subject: `${name} - ${email}`,
			text: message
		};

		mg.messages().send(mailgunData, (error) => {
			if (error) {return response.json("error sending email through email handler, please try again later")}
		})

		const errors = validationResult(request)

		if(!errors.isEmpty()) {
			const currentError = errors.array()[0]
			return response.json(`Bad Request: Error ${currentError.msg}`)
		}

		response.append('Access-Control-Allow-Origin', ['*']) // Comment out before PWP is hosted with docker
		console.log(request.body)
		return response.json("Is this on?")
})

app.use(indexRoute)
app.listen(4200,() => {console.log("The server has started")} )