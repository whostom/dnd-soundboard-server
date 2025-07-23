const db = require('./DbConnection')

async function EditSound(soundId, name, icon, categoryId) {
	try {
		const fields = []
		const values = []

		if (name) {
			fields.push('name = ?')
			values.push(name)
		}
		if (icon) {
			fields.push('icon = ?')
			values.push(icon)
		}
		if (categoryId) {
			fields.push('category_id = ?')
			values.push(categoryId)
		}

		if (fields.length === 0) {
			throw new Error('No fields provided to update')
		}

		const query = `UPDATE sounds SET ${fields.join(', ')} WHERE sound_id = ?`
		values.push(soundId)

		const [result] = await db.query(query, values)

		console.log('Sound updated successfully:', result)
		return result
	} catch (err) {
		console.error('Error updating sound:', err.message)
		throw err
	}
}

module.exports = { EditSound }
