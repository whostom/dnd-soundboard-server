const db = require('./DbConnection')

function RequestAllSounds() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT name, server_name as sound, users.login as author, profile as author_profile FROM sounds JOIN users on users.login = sounds.author_id'

        db.query(query, [], (err, results) => {
            if (err) {
                console.error('Error reading user list:', err.message)
                return reject(err)
            }

            results.forEach(result => {
                console.log(result)
                if (result.author_profile) {
                    result.author_profile = `mnt/dnd-soundboard/profiles/${result.profile}`
                }
                else {
                    result.author_profile = `mnt/dnd-soundboard/profiles/default.png`
                    //add default.png on server
                }

                result.sound = `mnt/dnd-soundboard/sounds/${result.sound}`
            })

            console.log('Users read successfully:', results)
            resolve(results)
        })
    })
}

module.exports = { RequestAllSounds }