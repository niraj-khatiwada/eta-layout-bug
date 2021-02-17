const Product = require('../models/product')
const CartItem = require('../models/cartItem')

exports.getProducts = async (req, res) => {
  try {
    const isAuthenticated = req.session.isAuthenticated
    const products = await Product.findAll()
    return res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Products',
      path: 'shop/products',
      isAuthenticated,
    })
  } catch (error) {
    console.log('Error getting all products', error)
  }
}

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId

  try {
    const product = await Product.findByPk(prodId)
    if (prodId) {
      const isAuthenticated = req.session.isAuthenticated
      return res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated,
      })
    }
    return res.render('shop/product-detail', {
      product: null,
      pageTitle: 'No product found',
      path: '/products',
    })
  } catch (error) {
    console.log('Error getting product', error)
  }
}

exports.getIndex = async (req, res, next) => {
  try {
    const isAuthenticated = req.session.isAuthenticated
    const products = await Product.findAll()
    const flashMessage = req.flash('success')
    const errorMessage = req.flash('error')
    return res.render('shop/index', {
      prods: [],
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated,
      success: flashMessage || '',
      error: errorMessage || '',
    })
  } catch (error) {
    console.log('Error on getIndex', error)
  }
}

exports.getCart = async (req, res) => {
  const user = req.session.user
  const isAuthenticated = req.session.isAuthenticated
  try {
    const cart = await user.getCart()
    if (cart) {
      const getCartProducts = await CartItem.findAll({
        where: {
          cartId: cart.id,
        },
      })
      const mapAllProducts = new Promise((resolve, reject) => {
        if (getCartProducts.length === 0) {
          resolve([])
        }
        let items = []
        getCartProducts.forEach(async (item, index) => {
          try {
            const product = await Product.findByPk(item.productId)
            items = [
              ...items,
              {
                title: product.title,
                id: product.id,
                quantity: item.quantity,
                ...item,
              },
            ]
            if (index === getCartProducts.length - 1) {
              resolve(items)
            }
          } catch (error) {
            reject(error)
          }
        })
      })
      const products = await mapAllProducts

      return res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated,
      })
    }
    return res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: [],
      isAuthenticated,
    })
  } catch (error) {
    console.log(error)
  }
}

exports.postCart = async (req, res) => {
  const productId = req.body.productId

  const user = req.session.user
  try {
    let userCart = await user.getCart()
    if (!userCart) {
      userCart = await user.createCart()
    }
    const productExists = await CartItem.findAll({
      where: {
        productId,
      },
    })
    if (productExists && productExists.length > 0) {
      productExists[0].quantity = productExists[0].quantity + 1
      productExists[0].save()
    } else {
      await CartItem.create({
        quantity: 1,
        productId,
        cartId: userCart.id,
      })
    }
    return res.redirect('/cart')
  } catch (error) {
    console.log(error)
  }
}

exports.postCartDeleteProduct = async (req, res) => {
  const productId = req.body.productId
  const user = req.session.user
  try {
    const cart = await user.getCart()
    const cartItem = await CartItem.findAll({
      where: {
        productId,
        cartId: cart.id,
      },
    })
    if (cartItem.length > 0) {
      cartItem[0].destroy()
    }
    return res.redirect('/cart')
  } catch (error) {
    console.log(error)
  }
}

exports.getOrders = (req, res, next) => {
  const isAuthenticated = req.session.isAuthenticated

  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    isAuthenticated,
  })
}

exports.getCheckout = async (req, res) => {
  const user = req.session.user
  try {
    const cart = await user.getCart()
    if (cart) {
      const cartItems = await CartItem.findAll({
        where: {
          cartId: cart.id,
        },
      })
      if (cartItems.length > 0) {
        const order = await user.createOrder()
        if (order) {
          cartItems.forEach(async (items) => {
            await order.createOrderItem({
              quantity: items.quantity,
              productId: items.productId,
            })
          })
          cart.destroy()
        }
      }
    }
  } catch (error) {
    console.log(error)
  }

  res.redirect('/')
}
