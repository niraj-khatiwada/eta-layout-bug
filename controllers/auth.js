const crypto = require('crypto')
const bcrypt = require('bcrypt')

const Op = require('sequelize').Op

const { sendMail } = require('../util/helpers')

const User = require('../models/user')

exports.getLogin = (req, res) => {
  const isAuthenticated = req.session.isAuthenticated

  const flashMessage = req.flash('error')

  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/auth/login',
    isAuthenticated,
    error: {
      email:
        Array.isArray(flashMessage) && flashMessage.length > 0
          ? flashMessage[0].email
          : '',
    },
  })
}

exports.postLogin = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  try {
    const userExists = await User.findOne({ email })
    if (!userExists) {
      req.flash('error', { email: 'Invalid Email or Password' })
      return res.redirect('/auth/login')
    }

    const comparePassword = await bcrypt.compare(password, userExists.password)

    if (comparePassword) {
      req.session.isAuthenticated = true
      req.session.user = userExists
      await req.session.save(() => {
        res.redirect('/')
      })
      return
    }
    req.flash('error', { email: 'Invalid Email or Password' })
    return res.redirect('/auth/login')
  } catch (error) {
    console.log('LOGIN ERROR', error)
    res.redirect('/auth/login')
  }
}

exports.getSignup = (req, res, next) => {
  const flashMessage = req.flash('error')
  console.log(flashMessage)
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    error: flashMessage,
  })
}
exports.postSignup = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  try {
    const userExists = await User.findOne({ email })
    if (!userExists) {
      const hashPassword = await bcrypt.hash(password, 12)
      await User.create({ email, password: hashPassword })
      await sendMail(
        email,
        'SignUp succeeded',
        '<h1>Welcome to nodeJS advanced course</h1>'
      )
      return res.redirect('/auth/login')
    }
    req.flash('error', 'User already exists' )
    console.log('user already exists')
    return res.redirect('/auth/signup')
  } catch (error) {
    console.log(error)
  }
}
exports.postLogout = async (req, res) => {
  console.log(req)
  try {
    await req.session.destroy()
  } catch (error) {
    console.log('Logout error', error)
  }
  return res.redirect('/')
}

exports.getReset = (req, res, next) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    error: message,
  })
}
exports.postReset = async (req, res) => {
  const email = req.body.email
  try {
    const userExists = await User.findOne({ where: { email } })
    if (!userExists) {
      req.flash('error', 'User does not exists in the system')
      return res.redirect('/auth/reset')
    }
    crypto.randomBytes(32, async (error, buffer) => {
      if (error) {
        console.log(error)
        req.flash('error', 'Some thing went wrong.')
        return res.redirect('/auth/reset')
      }
      try {
        const string = buffer.toString('hex')
        userExists.resetToken = string
        userExists.resetTokenExpiry = Date.now() + 60 * 60 * 1000
        userExists.save()
        await sendMail(
          email,
          'Password reset link',
          `<a href="http://localhost:3001/auth/new-password/${string}">Reset Link</a>`
        )
        req.flash('success', 'Please check your inbox for password reset link.')
        res.redirect('/')
      } catch (error) {
        console.log(error)
      }
    })
  } catch (error) {
    console.log(error)
    req.flash('error', 'Something went wrong')
    res.redirect('/auth/reset')
  }
}
exports.getNewPassword = async (req, res, next) => {
  const resetToken = req.params.id

  try {
    const user = await User.findOne({
      where: { resetToken, resetTokenExpiry: { [Op.gt]: new Date() } },
    })
    console.log('user', user)
    if (!user) {
      req.flash('error', 'Token invalid')
      return res.redirect('/')
    }

    return res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'Confirm New  Password',
      error: '',
      userId: user.id,
      token: user.resetToken,
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
}
exports.postNewPassword = async (req, res) => {
  // const token = req.body.userId
  console.log('Reset token', req.body)
}
