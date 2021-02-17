module.exports = (req, res, next) => {
  const isAuthenticated = req.session.isAuthenticated

  if (!isAuthenticated) {
    return res.redirect('/auth/login')
  }
  next()
}
