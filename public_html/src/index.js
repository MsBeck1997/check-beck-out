const express = require('express')
const morgan = require('morgan')
const mailgun = require('mailgun-js')
const bodyParser = require('body-parser')
const {check, validationResult} = require("express-validator")
const Recaptcha = require('express-recaptcha').RecaptchaV2

// Initializing Express Application
const app = express()

// Making express aware of project-wide middleware
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY)
const indexRoute = express.Router()

const requestValidation = [
	check("email", "A valid email is required".isEmail().normalizeEmail(),
	check ('name', 'A name is required to send an email').not().isEmpty().trim().escape(),
	check ('subject').optional().trim().escape(),
	check('message', 'A message is required to send email.').not().isEmpty().trim().escape().isLength({max:2000}))
]

indexRoute.route('/apis')
	.get((request, response) => {
<<<<<<< HEAD
		return response.json("Is this thing on?")
	}).post(recaptcha.middleware.verify, requestValidation, (request, response) => {

	response.append('Content-Type', 'text/html')

	if (request.recaptcha.error) {
		return response.send(`<div class='alert alert-danger' role='alert'>There was an error with Recaptcha. Please try again later.</div>`)
	}
=======
	return response.json("Testing A")
	})
	.post( requestValidation, (request, response) => {
		const domain = process.env.MAILGUN_DOMAIN
		const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: domain});
>>>>>>> 0675cfe537877810324eebc6f56bba81696afae9

	const errors = validationResult(request)

<<<<<<< HEAD
	if (!errors.isEmpty()) {
		const currentError = errors.array()[0]
		return response.send(Buffer.from(`<div class='alert alert-danger' role='alert'>${currentError.msg}</div>`))
	}

	const domain = process.env.MAILGUN_DOMAIN
	const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: domain});
	const {email, subject, name, message} = request.body
=======
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
>>>>>>> 0675cfe537877810324eebc6f56bba81696afae9

	const mailgunData = {
		to: process.env.MAIL_RECIPIENT,
		from: `Mailgun Sandbox <postmaster@${domain}>`,
		subject: `${name} - ${email}: ${subject}`,
		text: message
	}

	mg.messages().send(mailgunData, (error) => {
		if (error) {
			return response.send(Buffer.from(`<div class='alert alert-danger' role='alert'>Unable to send email error with email sender, please try again later.</div>`))
		}
	})

	return response.send(Buffer.from("<div class='alert alert-success' role='alert'>Email successfully sent.</div>"))
})

app.use(indexRoute)

app.listen(4200, () => {console.log("The server has started")})