const { DataTypes } = require('sequelize')

const sequelize = require('../util/database')
const Cart = require('./cart')
const CartItem = require('./cartItem')
const Order = require('./order')
const OrderItem = require('./orderItem')

const Product = sequelize.define(
  'product',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        max: 50,
      },
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
  },
  {
    timestamps: true,
  }
)

Product.belongsToMany(Cart, { through: CartItem })
Cart.belongsToMany(Product, { through: CartItem })

Product.belongsToMany(Order, { through: OrderItem })
Order.belongsToMany(Product, { through: OrderItem })

module.exports = Product
