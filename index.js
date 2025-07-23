const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const Database = require('./Database')
const path = require('path')
const cors = require('cors')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const { Readable } = require('stream')
// const Readable = requ
// import streamifier from 'streamifier';
// import { CropAudioFile } from './Database/CropAudioFile'

app.use(cors())
app.use(express.json())
const basePath = '/mnt/dnd-soundboard/sounds'

const allowedIP = '192.168.68.166'
//tak wiem ze brak bezpieczenstwa, kiedys zmienie na cos lepszego

// const uploadSound = multer({ s})

// const soundStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(basePath, 'sounds'))
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname)
//         const fileName = uuidv4()d
//         cb(null, fileName + ext)
//     }
// })

const soundStorage = multer.memoryStorage();

const uploadSound = multer({ storage: soundStorage })

const io = new Server(server, {
	maxHttpBufferSize: 1e8,
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	}
})

io.use((socket, next) => {
	const ip = socket.handshake.address
	if (ip === allowedIP || ip === `::ffff:${allowedIP}`) {
		return next()
	}

	console.log(`Blocked IP: ${ip}`)
	next(new Error("Unauthorized IP"))
})

io.on('connection', (socket) => {
	console.log('Malinka joined:', socket.id)

	socket.on('disconnect', () => {
		console.log('Malinka disconnected')
	})
})

app.post('/get-sounds', (req, res) => {
	const folderId = req.body.folderId

	Database.GetAllSounds(folderId)
		.then((result) => {
			res.status(200).json({ success: true, result: result });
		})
		.catch(err => {
			res.status(500).json({ error: 'Failed to get sound list' })
		})
})

app.post('/get-all-categories', (req, res) => {
	Database.GetAllCategories()
		.then((result) => {
			res.status(200).json({ success: true, result })
		})
		.catch(err => {
			res.status(500).json({ error: 'Failed to get all categories' })
		})
})

app.post('/get-all-folders', (req, res) => {
	Database.GetAllFolders()
		.then((result) => {
			res.status(200).json({ success: true, result: result });
		})
		.catch(err => {
			res.status(500).json({ error: 'Failed to get all folders' })
		})
})

app.post('/upload-sound', uploadSound.single('file'), async (req, res) => {
	// const soundName = req.file.originalname
	// const serverSoundName = req.file.filename
	// const icon = req.body.icon
	// const soundStart = req.body.soundStart
	// const soundEnd = req.body.soundStart
	const { buffer, originalname } = req.file

	const fileName = uuidv4()

	const ext = path.extname(originalname).toLowerCase()

	const stream = new Readable()
	stream.push(buffer)
	stream.push(null)

	const finalPath = path.join(basePath, `${fileName}${ext}`)

	await new Promise((resolve, reject) => {
		ffmpeg(stream)
			.inputFormat('mp3')
			.setStartTime(2)
			.duration(1)
			.outputFormat('mp3')
			.output(finalPath)
			.on('end', resolve)
			.on('error', reject)
			.run()
	})

	console.log(finalPath)
	//add sound to database (uuid!!!)

	res.status(200).json({ success: true, result: null })
})

app.post('/edit-sound', (req, res) => {
	const soundId = req.body.soundId
	const newName = req.body.newName
	const newIcon = req.body.newIcon
	const newCategory = req.body.newCategory

	Database.EditSound(soundId, newName, newIcon, newCategory)
		.then((result) => {
			res.status(200).json({ success: true, result })
		})
		.catch(err => {
			res.status(500).json({ error: 'Failed to edit sound' })
		})
})

app.post('/delete-sound', (req, res) => {
	const soundId = req.body.soundId

	Database.DeleteSound(soundId, newName, newIcon, newCategory)
		.then((result) => {
			res.status(200).json({ success: true, result })
		})
		.catch(err => {
			res.status(500).json({ error: 'Failed to delete sound' })
		})
})

app.post('/play-sound', (req, res) => {
	const soundId = req.body.soundId

	Database.GetServerSoundName(soundId)
		.then(fileName => {
			io.emit('play-sound', fileName)
			console.log(`Play sound: '${fileName}'`)
		})
		.catch(err => {
			console.error(err.message)
		})
})

//queue


//search
app.post('/search-sound', (req, res) => {
	const term = req.body.searchTerm

	Database.SearchSounds(term)
		.then((result) => {
			res.status(200).json({ success: true, result })
		})
		.catch(err => {
			res.status(500).json({ error: 'Failed to find sound' })
		})
})



server.listen(3000, () => {
	console.log('Listening on localhost:3000')
})