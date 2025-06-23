const db = require('./DbConnection')
const { AddSound } = require('./AddSound')
const { PlaySound } = require('./PlaySound')
const { EditSound } = require('./EditSound')
const { GetAllCategories } = require('./GetAllCategories')
const { RequestAllSounds } = require('./RequestAllSounds')
const { DeleteSound } = require('./DeleteSound')
const { SearchSound } = require('./SearchSound.js')
const { GetServerSoundName} = require('./GetServerName.js')


module.exports = {
    db,
    AddSound,
    PlaySound,
    EditSound,
    GetAllCategories,
    RequestAllSounds,
    DeleteSound,
    SearchSound,
    GetServerSoundName
}