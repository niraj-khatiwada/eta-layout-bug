const fs = require('fs')
const path = require('path')

const Product = require('../models/product')

const { createSession } = require('../util/payment')

const ITEMS_PER_PAGE = 2

exports.getAddProduct = (req, res) => {
  const isAuthenticated = req.session.isAuthenticated
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated,
  })
}

exports.postAddProduct = async (req, res) => {
  console.log(req.file)

  const title = req.body.title
  const imageUrl = req.file.path
  const price = req.body.price
  const description = req.body.description
  const user = req.session.user

  try {
    await Product.create({
      title,
      imageUrl,
      price,
      description,
      userId: user.id,
    })
    res.redirect('/')
  } catch (error) {
    console.log('Product creation error', error)
  }
}

exports.getEditProduct = async (req, res) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId

  try {
    const findProduct = await Product.findByPk(prodId)
    if (findProduct) {
      const isAuthenticated = req.session.isAuthenticated
      return res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: findProduct,
        isAuthenticated,
      })
    }
    return res.redirect('/')
  } catch (error) {}
}

exports.postEditProduct = async (req, res) => {
  const prodId = req.body.productId
  const title = req.body.title
  const price = req.body.price

  const imageUrl = req.body.imageUrl
  const description = req.body.description

  try {
    const getProduct = await Product.findByPk(prodId)
    if (prodId) {
      getProduct.title = title
      getProduct.price = price
      getProduct.imageUrl = imageUrl
      getProduct.description = description
      getProduct.save()
      return res.redirect('/admin/products')
    }
    return res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}

exports.getProducts = async (req, res, _2) => {
  const page = req.query.page || 1
  try {
    const isAuthenticated = req.session.isAuthenticated
    const offset = (+page - 1) * ITEMS_PER_PAGE
    const totalProducts = await Product.count()
    const products = await Product.findAll({
      limit: ITEMS_PER_PAGE,
      offset,
    })

    return res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated,
      currentPage: page,
      hasNext: +page * ITEMS_PER_PAGE < totalProducts,
      hasPrev: +page !== 1,
      lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
    })
  } catch (error) {
    console.log('Error in getProducts', error)
  }
}

exports.postDeleteProduct = async (req, res) => {
  const prodId = req.params.productId
  try {
    const findProduct = await Product.findByPk(prodId)
    if (findProduct) {
      findProduct.destroy()
      return res.status(200).json({ message: 'SUCCESS' })
    }
    return res.status(201).json({ message: 'PRODUCT_DOES_NOT_EXIST' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'ERROR' })
  }
}
exports.downloadFile = (req, res) => {
  const downloadId = req.params.id
  const fileId = 'download-' + downloadId + '.pdf'
  console.log('File id', fileId)

  const stream = fs.createReadStream(path.join('uploads', 'files', fileId))
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'attachment; filename="abc.pdf"')
  stream.pipe(res)
}
exports.createCheckoutSession = async (req, res) => {
  try {
    const sessionId = await createSession()
    console.log(sessionId)
    if (sessionId) {
      res.json({ sessionId, message: 'SUCCESS' })
    }
    res.json({ sessionId: null, message: 'ERROR' })
  } catch (error) {
    res.json({ sessionId: null, message: 'ERROR' })
  }
}
