const express = require('express')

const router = express.Router()

const {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  postLogout,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require('../controllers/auth.js')

router.get('/login', getLogin)
router.post('/login', postLogin)

router.get('/signup', getSignup)

router.post('/signup', postSignup)
router.post('/logout', postLogout)
router.get('/reset', getReset)
router.post('/reset', postReset)
router.get('/new-password/:id', getNewPassword)
router.post('/new-password', postNewPassword)

module.exports = router
