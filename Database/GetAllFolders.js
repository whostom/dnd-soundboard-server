const db = require('./DbConnection')

function GetAllFolders() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM folders'

        db.query(query, [], (err, results) => {
            if (err) {
                console.error('Error reading folders', err.message)
                return reject(err)
            }

            console.log('Folders read successfully:', results)
            resolve(results)
        })
    })
}

module.exports = { GetAllFolders }