const db = require('./DbConnection')

function GetAllSounds() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM categories'

        db.query(query, [], (err, results) => {
            if (err) {
                console.error('Error reading categories', err.message)
                return reject(err)
            }

            console.log('Categories read successfully:', results)
            resolve(results)
        })
    })
}

module.exports = { GetAllSounds }