const db = require('./DbConnection')

async function GetServerSoundName(soundId) {
	try {
		const [results] = await db.query(
			'SELECT server_name FROM sounds WHERE sound_id = ?',
			[soundId]
		)

		if (!results || results.length === 0) {
			throw new Error('Sound not found')
		}
		console.log('Server sound name read successfully: ', results[0].server_name)
		return results[0].server_name
	} catch (err) {
		console.error('Error while getting server sound name:', err.message)
		throw err
	}
}

module.exports = { GetServerSoundName }
