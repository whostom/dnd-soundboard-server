const db = require('./DbConnection')
const crypto = require('crypto')

function RegisterUser(login, pass, email) {
    return new Promise((resolve, reject) => {
        const checkQuery = 'SELECT * FROM `users` WHERE `login` = ? OR `email` = ?'

        db.query(checkQuery, [login, email], (err, results) => {
            if (err) {
                console.error('Error checking user existence:', err.message)
                return reject(err)
            }

            if (results.length > 0) {
                return reject(new Error('User with this login or email already exists.'))
            }

            const insertQuery = 'INSERT INTO `users` (`login`, `pass`, `profile`) VALUES (?, ?, ?, "")'
            const hash = crypto.createHash('sha256').update(pass).digest('hex')

            db.query(insertQuery, [login, hash, email], (err, results) => {
                if (err) {
                    console.error('Error adding user:', err.message)
                    return reject(err)
                }
                console.log('User added successfully:', results.insertId)
                resolve(results)
            })
        })
    })
}

module.exports = { RegisterUser }