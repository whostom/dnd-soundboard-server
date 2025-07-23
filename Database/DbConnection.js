const mysql = require('mysql2/promise')

const pool = mysql.createPool({
	host: '192.168.68.155',
	user: 'db-user',
	database: 'dnd-soundboard',
	password: 'dndsoundboard',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 10000
});

console.log('Database pool created successfully');

module.exports = pool;