const mysql = require('mysql2')

const db = mysql.createConnection({
    host: '192.168.68.155',
    user: 'db-user',
    database: 'dnd-soundboard',
    password: 'dndsoundboard'
})

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.message)
        return
    }
    console.log('Database connected successfully')
})

module.exports = db