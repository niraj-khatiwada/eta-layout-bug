const { DataTypes } = require('sequelize')

const sequelize = require('../util/database')

module.exports = sequelize.define('Session', {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  expires: DataTypes.DATE,
  data: DataTypes.STRING(50000),
})
