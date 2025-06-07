const db = require('./DbConnection')
const jwt = require('jsonwebtoken')
const secretKey = 'g@Pb*VFbC8r#p$'

function LoginUser(username, hashedPassword, email) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM `users` WHERE (`login` = ? OR `email` = ?) AND `pass` = ?;'

        db.query(query, [username, email, hashedPassword], (err, results) => {
            if (err) {
                console.error('Database error:', err.message)
                reject(err)
                return
            }
            if (results.length == 0) {
                console.log('No user found with provided credentials')
                reject(new Error('No user found with provided credentials'))
                return
            }
            const user = results[0]
            const token = jwt.sign({ id: user.user_id, login: user.login }, secretKey, { expiresIn: '1h' })
            console.log('User ' + user.login + ' found and successfuly logged')
            resolve({user, token})
        })
    })
}

module.exports = { LoginUser }