const db = require('./DbConnection')

//tylko mp3!!!!!

function AddSound(userId, serverSoundName, soundName) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO `sounds` (`name`, `server_name`, `author_id`) VALUES (?, ?, ?)'

        db.query(query, [soundName,serverSoundName, userId], (err, result) => {
            if (err) {
                console.error('Error adding sound to database:', err.message);
                return reject(err);
            }
            console.log('Sound added successfully:', result);
            return resolve()
        });
    });
}

module.exports = { AddSound }