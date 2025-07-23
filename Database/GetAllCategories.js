const db = require('./DbConnection')

async function GetAllCategories() {
	try {
		const [results] = await db.query('SELECT * FROM categories')
		console.log('Categories read successfully:', results)
		return results
	} catch (err) {
		console.error('Error reading categories:', err.message)
		throw err
	}
}

module.exports = { GetAllCategories }
