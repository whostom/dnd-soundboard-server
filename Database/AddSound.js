const db = require('./DbConnection')

//tylko mp3!!!!!

function AddSound(soundName, icon, serverSoundName) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO `sounds` (`name`,`icon`, `server_name`, ) VALUES (?, ?, ?)'

        db.query(query, [soundName, icon, serverSoundName], (err, result) => {
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