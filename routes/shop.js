const express = require('express')

const shopController = require('../controllers/shop')
const withProtectedRoute = require('../middleware/withProtectedRoute')

const router = express.Router()

router.get('/', shopController.getIndex)

router.get('/products', shopController.getProducts)

router.get('/products/:productId', shopController.getProduct)

router.get('/cart', withProtectedRoute, shopController.getCart)

router.post('/cart', withProtectedRoute, shopController.postCart)

router.post(
  '/cart-delete-item',
  withProtectedRoute,
  shopController.postCartDeleteProduct
)

router.get('/orders', withProtectedRoute, shopController.getOrders)

router.post('/checkout', withProtectedRoute, shopController.getCheckout)

module.exports = router
