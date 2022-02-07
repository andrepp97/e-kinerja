const mysql = require('mysql')

const conn = mysql.createPool({
    /**LOCAL DB HOST */
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'foresta',
    database: 'ekinerja',
    timezone: 'UTC',
})

module.exports = {
    sqlDB: conn
}