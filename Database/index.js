const db = require('./DbConnection')
const { AddSound } = require('./AddSound')
const { PlaySound } = require('./PlaySound')
const { EditSound } = require('./EditSound')
const { GetAllCategories } = require('./GetAllCategories')
const { GetAllFolders } = require('./GetAllFolders')
const { RequestAllSounds } = require('./RequestAllSounds')
const { DeleteSound } = require('./DeleteSound')
const { SearchSound } = require('./SearchSound.js')
const { GetServerSoundName} = require('./GetServerSoundName.js')


module.exports = {
    db,
    AddSound,
    PlaySound,
    EditSound,
    GetAllFolders,
    GetAllCategories,
    RequestAllSounds,
    DeleteSound,
    SearchSound,
    GetServerSoundName
}