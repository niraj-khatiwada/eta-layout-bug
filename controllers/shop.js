exports.getIndex = async (req, res, next) => {
  try {
    return res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
    })
  } catch (error) {
    console.log('Error on getIndex', error)
  }
}
