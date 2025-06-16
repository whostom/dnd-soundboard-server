const db = require('./DbConnection')

function EditSound(soundId, name, icon, categoryId) {
    return new Promise((resolve, reject) => {
        var query = 'UPDATE sounds SET '
        if(name) query += `sound_name = '${name}'`
        if(icon) {
            if(name) query += `,`
            query += `sound_icon = '${icon}'`
        }
        if(categoryId) {
            if(icon || name) query += `,`
            query += `category_id = '${categoryId}'`
        }
        query += ` WHERE sound_id = '${soundId}'`
        
        db.query(query, [], (err, results) => {
            if (err) {
                console.error('Error updating categories', err.message)
                return reject(err)
            }

            console.log('Sound updated successfully:', results)
            resolve(results)
        })
    })
}

module.exports = { EditSound }