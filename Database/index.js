const db = require('./DbConnection')
const { AddSound } = require('./AddSound')
const { PlaySound } = require('./PlaySound')
const { EditSound } = require('./EditSound')
const { GetAllCategories } = require('./GetAllCategories')
const { GetAllFolders } = require('./GetAllFolders')
const { GetAllSounds } = require('./GetAllSounds')
const { DeleteSound } = require('./DeleteSound')
const { SearchSounds } = require('./SearchSounds.js')
const { GetServerSoundName } = require('./GetServerSoundName.js')


module.exports = {
	db,
	AddSound,
	PlaySound,
	EditSound,
	GetAllFolders,
	GetAllCategories,
	GetAllSounds,
	DeleteSound,
	SearchSounds,
	GetServerSoundName
}