const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'eta')
app.set('views', 'views')

const { getIndex } = require('./controllers/shop')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', getIndex)

app.listen(3001, () => console.log('Server started at port 3001'))
