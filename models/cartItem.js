const { DataTypes } = require('sequelize')

const sequelize = require('../util/database')

module.exports = sequelize.define('cartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
})
