const { DataTypes } = require('sequelize')

const sequelize = require('../util/database')

const OrderItem = require('./orderItem')

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
})

Order.hasMany(OrderItem, { constraints: true, onDelete: 'CASCADE' })

module.exports = Order
