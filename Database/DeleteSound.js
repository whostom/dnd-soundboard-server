const db = require('./DbConnection')

function DeleteSound(soundId) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM sounds WHERE sound_id = ?`

        db.query(query, soundId, (err, result) => {
            if (err) {
                console.error('Error deleting a sound:', err.message);
                return reject(err);
            }
            console.log('Sound deleted successfully:', result);
        });

        const relationsQuery = `DELETE FROM relations WHERE sound_id = ?`
        db.query(relationsQuery, soundId, (err, result) => {
            if (err) {
                console.error('Error deleting sound relations:', err.message);
                return reject(err);
            }
            console.log('Sound relations deleted successfully:', result);
        });

        return resolve()
    });
}

module.exports = { DeleteSound }