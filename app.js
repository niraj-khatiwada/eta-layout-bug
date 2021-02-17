const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')

const SequelizeStore = require('connect-session-sequelize')(session.Store)
const csrfProtection = csrf()

const errorController = require('./controllers/error')
const db = require('./util/database')
const { fileSystem } = require('./util/helpers')

const User = require('./models/user')

const app = express()

app.set('view engine', 'eta')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  multer({
    storage: fileSystem.fileStorage,
    fileFilter: fileSystem.filterFiles,
  }).single('image')
)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(
  session({
    secret: 'MY_SECRET_KEY',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 24 * 60 * 60 },
    store: new SequelizeStore({
      db,
      table: 'Session',
    }),
  })
)
app.use(csrfProtection)
app.use(flash())

app.use(async (req, _, next) => {
  if (req.session.user) {
    const user = await User.findByPk(req.session.user.id)
    if (user) {
      req.user = user
    }
  }
  next()
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated
  res.locals.csrfToken = req.csrfToken()
  next()
})
// app.get('/abc', (_, res) => {
//   res.send({ abc: 'abc' })
// })

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use('/auth', authRoutes)
app.use(errorController.get404)

// Sync all models
db.sync({ force: false })
  .then(() => {
    console.log('All models synced')
  })
  .catch((error) => {
    console.log('Model sync error', error)
  })

app.listen(3001, () => console.log('Server started at port 3001'))
