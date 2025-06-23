const db = require('./DbConnection')

function SearchSounds(searchTerm) {
    return new Promise((resolve, reject) => {
        const query = `SELECT sounds.sound_id, sounds.name, sounds.icon, categories.category FROM sounds JOIN categories ON sounds.category_id = categories.category_id WHERE sounds.name LIKE ?`

        db.query(query, [`%${searchTerm}%`], (err, soundResults) => {
            if (err) {
                console.error('Error searching sounds:', err.message)
                return reject(err)
            }

            const soundIds = soundResults.map(s => s.sound_id)
            if (soundIds.length === 0) {
                return resolve([])
            }

            const relationsQuery = `SELECT relations.sound_id, folders.folder_name FROM relations JOIN folders ON folders.folder_id = relations.folder_id WHERE relations.sound_id IN (?)`

            db.query(relationsQuery, [soundIds], (relErr, relationsResults) => {
                if (relErr) {
                    console.error('Error reading relations:', relErr.message)
                    return reject(relErr)
                }

                const foldersMap = {}
                relationsResults.forEach(rel => {
                    if (!foldersMap[rel.sound_id]) {
                        foldersMap[rel.sound_id] = []
                    }
                    foldersMap[rel.sound_id].push(rel.folder_name)
                })

                const resultsWithFolders = soundResults.map(sound => ({
                    ...sound,
                    folders: foldersMap[sound.sound_id] || []
                }))

                resolve(resultsWithFolders)
            })
        })
    })
}

module.exports = { SearchSounds }
