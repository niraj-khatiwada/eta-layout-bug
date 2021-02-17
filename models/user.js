const { DataTypes } = require('sequelize')

const sequelize = require('../util/database')

const Product = require('./product')
const Cart = require('./cart')
const Order = require('./order')
const Session = require('./session')

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        max: 50,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: DataTypes.STRING,
    resetToken: DataTypes.STRING,
    resetTokenExpiry: DataTypes.DATE,
  },
  {
    timestamps: true,
  }
)

User.hasMany(Product, {
  foreignKey: {
    allowNull: false,
  },
  constraints: true,
  onDelete: 'CASCADE',
})

User.hasOne(Cart, {
  foreignKey: {
    allowNull: false,
  },
  constraints: true,
  onDelete: 'CASCADE',
})

User.hasMany(Order, { constraints: false, onDelete: 'CASCADE' })

module.exports = User
