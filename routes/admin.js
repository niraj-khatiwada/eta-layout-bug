const express = require('express')

const adminController = require('../controllers/admin')
const withProtectedRoute = require('../middleware/withProtectedRoute')

const router = express.Router()

// /admin/add-product => GET
router.get('/add-product', withProtectedRoute, adminController.getAddProduct)

// /admin/products => GET
router.get('/products', adminController.getProducts)

// /admin/add-product => POST
router.post('/add-product', withProtectedRoute, adminController.postAddProduct)

router.get(
  '/edit-product/:productId',
  withProtectedRoute,
  adminController.getEditProduct
)

router.post(
  '/edit-product',
  withProtectedRoute,
  adminController.postEditProduct
)

router.delete(
  '/delete-product/:productId',
  withProtectedRoute,
  adminController.postDeleteProduct
)

router.get('/download/:id', adminController.downloadFile)
router.post('/create-checkout-session', adminController.createCheckoutSession)

module.exports = router
