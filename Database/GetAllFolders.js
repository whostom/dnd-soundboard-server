const db = require('./DbConnection')

async function GetAllFolders() {
	try {
		const [results] = await db.query('SELECT * FROM folders')
		console.log('Folders read successfully:', results)
		return results
	} catch (err) {
		console.error('Error reading folders:', err.message)
		throw err
	}
}

module.exports = { GetAllFolders }
