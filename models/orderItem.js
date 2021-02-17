const { DataTypes } = require('sequelize')

const sequelize = require('../util/database')

module.exports = sequelize.define('orderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
})
