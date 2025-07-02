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

app.use(express.json())
const basePath = '/mnt/dnd-soundboard/sounds'

const MALINKA_TOKEN = 'w20v4qhhcmr355sclv12n6fov';
//tak wiem ze brak bezpieczenstwa, kiedys zmienie na cos lepszego .e

const soundStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(basePath, 'sounds'))
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const fileName = new uuidv4()
        cb(null, fileName + ext)
    }
})

const uploadSound = multer({ storage: soundStorage })

const io = new Server(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

const onlineUsers = []

io.on('connection', (socket) => {
    console.log('User connected:', socket.id)
    onlineUsers.push(socket.id)

    //inform others about playing sound 
    //gratis

    const token = socket.handshake.auth?.token;

    if (token === MALINKA_TOKEN) {
        socket.join('raspberryRoom');
        console.log('Malinka joined:', socket.id);
    } else {
        console.log('Client without valid token:', socket.id);
    }


    socket.on('disconnect', () => {
        console.log('User disconnected')

        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId)
                break
            }
        }
    })
})

app.use(cors())


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

app.post('/upload-sound', uploadSound.single('soundFile'), (req, res) => {
    const soundName = req.file.originalname
    const serverSoundName = req.file.filename
    const icon = req.body.icon

    Database.AddSound(soundName, icon, serverSoundName)
        .then((result) => {
            res.status(200).json({ success: true, result })
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to add new sound' })
        })
})

app.post('/edit-sound', (req, res) => {
    const soundId = req.body.soundId
    const newName = req.body.newName
    const newIcon = req.body.newIcon
    const newCategory = req.category

    Database.AddSound(soundId, newName, newIcon, newCategory)
        .then((result) => {
            res.status(200).json({ success: true, result })
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to edit sound' })
        })
})

app.post('/edit-sound', (req, res) => {
    const soundId = req.body.soundId

    Database.DeleteSound(soundId, newName, newIcon, newCategory)
        .then((result) => {
            res.status(200).json({ success: true, result })
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to delete sound' })
        })
})

app.post('/get-sounds', (req, res) => {
    const folderId = req.body.folderId

    Database.RequestAllSounds(folderId)
        .then((result) => {
          res.status(200).json({ success: true, result: result });
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to get sound list' })
        })
})


app.post('/play-sound', (req, res) => {
    const soundId = req.body.soundId

    Database.GetServerSoundName(soundId)
        .then(fileName => {
            io.to('raspberryRoom').emit('play-sound', fileName)
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

    Database.SearchSound(term)
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