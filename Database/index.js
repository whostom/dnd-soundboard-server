const db = require('./DbConnection')
const { AddSound } = require('./AddSound')
const { PlaySound } = require('./PlaySound')
const { EditSound } = require('./EditSound')
const { GetAllCategories } = require('./GetAllCategories')
const { RequestAllSounds } = require('./RequestAllSounds')
const { DeleteSound } = require('./DeleteSound')


module.exports = {
    db,
    AddSound,
    PlaySound,
    EditSound,
    GetAllCategories,
    RequestAllSounds,
    DeleteSound
}