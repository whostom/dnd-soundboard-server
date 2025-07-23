const db = require('./DbConnection')

async function DeleteSound(soundId) {
	try {
		const deleteSoundQuery = `DELETE FROM sounds WHERE sound_id = ?`
		const [soundResult] = await db.query(deleteSoundQuery, [soundId])
		console.log('Sound deleted successfully:', soundResult)

		const deleteRelationsQuery = `DELETE FROM relations WHERE sound_id = ?`
		const [relationsResult] = await db.query(deleteRelationsQuery, [soundId])
		console.log('Sound relations deleted successfully:', relationsResult)

		return true
	} catch (err) {
		console.error('Error deleting sound or relations:', err.message)
		throw err
	}
}

module.exports = { DeleteSound }