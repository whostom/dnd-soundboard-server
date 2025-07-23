const db = require('./DbConnection')

async function AddSound(soundName, icon, serverSoundName) {
	const query = 'INSERT INTO `sounds` (`name`, `icon`, `server_name`) VALUES (?, ?, ?)'
	try {
		const [result] = await db.query(query, [soundName, icon, serverSoundName])
		console.log('Sound added successfully:', result)
		return result
	} catch (err) {
		console.error('Error adding sound to database:', err.message)
		throw err
	}
}

module.exports = { AddSound }
