require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mailgun = require('mailgun-js')
const bodyParser = require('body-parser')

// Initializing Express Application
const app = express()

// Making express aware of project-wide middleware
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const indexRoute = express.Router()

indexRoute.route('/apis')
	.get((request, response) => {
	return response.json("Testing A")
	})
	.post((request, response) => {
		response.append('Access-Control-Allow-Origin', ['*']) // Comment out before PWP is hosted with dockernpm
		console.log(request.body)
		return response.json("Is this on?")
})

app.use(indexRoute)
app.listen(4200,() => {console.log("The server has started")} )