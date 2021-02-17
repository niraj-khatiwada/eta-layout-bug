const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('nodeJS', 'niraj', '****', {
  dialect: 'postgres',
})

module.exports = sequelize
