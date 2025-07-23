const db = require('./DbConnection')

async function GetAllSounds(folderId = null) {
	try {
		const soundsQuery = `
			SELECT sounds.sound_id, sounds.name, sounds.icon, categories.category_id
			FROM sounds
			JOIN categories ON sounds.category_id = categories.category_id
		`
		const [sounds] = await db.query(soundsQuery)

		let relationsQuery = `
			SELECT relations.sound_id, folders.folder_name
			FROM relations
			JOIN folders ON folders.folder_id = relations.folder_id
		`

		const relationsParams = []
		if (folderId !== null) {
			relationsQuery += ` WHERE folders.folder_id = ?`
			relationsParams.push(folderId)
		}

		const [relations] = await db.query(relationsQuery, relationsParams)
	
		const soundIdToFolders = {}

		relations.forEach(({ sound_id, folder_name }) => {
			if (!soundIdToFolders[sound_id]) {
				soundIdToFolders[sound_id] = []
			}
			soundIdToFolders[sound_id].push(folder_name)
		})

		const results = sounds.map(sound => ({
			...sound,
			folders: soundIdToFolders[sound.sound_id] || []
		}))

		console.log('Sounds read successfully:', results)

		return results
	} catch (err) {
		console.error('Error reading sounds:', err.message)
		throw err
	}
}

module.exports = { GetAllSounds }
