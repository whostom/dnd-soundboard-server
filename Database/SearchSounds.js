const db = require('./DbConnection')

async function SearchSounds(searchTerm) {
  try {
    const query = `
      SELECT sounds.sound_id, sounds.name, sounds.icon, categories.name
      FROM sounds
      JOIN categories ON sounds.category_id = categories.category_id
      WHERE sounds.name LIKE ?
    `

    const [soundResults] = await db.query(query, [`%${searchTerm}%`])

    if (soundResults.length === 0) {
      return []
    }

    const placeholders = soundResults.map(() => '?').join(',')
    const soundIds = soundResults.map(s => s.sound_id)

    const relationsQuery = `
      SELECT relations.sound_id, folders.folder_name
      FROM relations
      JOIN folders ON folders.folder_id = relations.folder_id
      WHERE relations.sound_id IN (${placeholders})
    `

    const [relationsResults] = await db.query(relationsQuery, soundIds)

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

    return resultsWithFolders
  } catch (err) {
    console.error('Error searching sounds:', err.message)
    throw err
  }
}

module.exports = { SearchSounds }
