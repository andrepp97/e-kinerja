const mysql = require('mysql')

const conn = mysql.createConnection({
    /**LOCAL DB HOST */
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'foresta',
    database: 'ekinerja',
    timezone: 'UTC'
})

module.exports = {
    sqlDB: conn
}