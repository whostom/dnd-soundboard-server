const db = require('./DbConnection')

function RequestAllSounds(folderId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT sound_id, sounds.name, icon, categories.category_id FROM sounds JOIN categories on sounds.category_id = categories.category_id`;

        db.query(query, [], (err, results) => {
            if (err) {
                console.error('Error reading user list:', err.message)
                return reject(err)
            }

            relationsPromise = new Promise(
                (resolveRelationsPromise, rejectRelationsPromise) => {
                    let relationsQuery = `SELECT sound_id, folders.folder_name FROM relations JOIN folders ON folders.folder_id = relations.folder_id`;
                    if (folderId != null)
                        relationsQuery += ` WHERE folders.folder_id = ?`;
                    db.query(
                        relationsQuery,
                        [folderId],
                        (relationsErr, relationsResults) => {
                            if (relationsErr) {
                                console.error(
                                    "Error reading relations:",
                                    relationsErr.message
                                );
                                return reject(rejectRelationsPromise);
                            }

                            results.forEach((result) => {
                                var folders = [];

                                relationsResults.forEach((relation) => {
                                    if ((result.sound_id = relation.sound_id)) {
                                        folders += relation.folder;
                                    }
                                });

                                results.folders = folders;
                                folders = [];
                            });

                            resolve(results);
                        }
                    );

                    // resolve(resolveRelationsPromise);
                }
            );
            // relationsQuery();

            console.log("Sounds read successfully:", results);
            // resolve(results);
        });
    });
}

module.exports = { RequestAllSounds }