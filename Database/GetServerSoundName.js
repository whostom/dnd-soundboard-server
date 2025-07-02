const db = require('./DbConnection')

function GetServerSoundName(soundId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT server_name FROM sounds WHERE sound_id = ?'
    console.log(soundId)
    db.query(query, [soundId], (err, results) => {
      if (err) {
        console.error('Error while getting server sound name:', err.message)
        return reject(err)
      }
      console.log(results)

      if (!results || results.length === 0) {
        return reject(new Error('Sound not found'))
      }

      resolve(results[0].server_name)
    })
  })
}

module.exports = { GetServerSoundName }
