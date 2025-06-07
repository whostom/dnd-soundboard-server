const db = require('./DbConnection')

function UpdateProfile(loggedUserId, profilePicture) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET profile = ? WHERE user_id = ?'

        db.query(query, [profilePicture, loggedUserId], (err, results) => {
            if (err) {
                console.error('Error updating profile picture:', err.message);
                return reject(err);
            }
            console.log('Profile changed successfully:', results);
        });
    });
}

module.exports = { UpdateProfile }