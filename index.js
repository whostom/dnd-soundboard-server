const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const Database = require('./Database')
const path = require('path')
const cors = require('cors')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const basePath = '/mnt/dnd-soundboard'

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

app.use(cors())


//get all categories


//poprawic
app.post('/upload-sound', uploadSound.single('soundFile'), (req, res) => {
    const userId = req.body.userId
    const soundName = req.file.originalname
    const serverSoundName = req.file.filename

    Database.AddSound(userId, serverSoundName, soundName)
        .then((result) => {
            res.status(200).json({ success: true, result });
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to add new sound' })
        })
})

//edit sound (soundId)


//delete sound (soundId)


//get-sounds
//podaje directory, jesli puste to podajhe wszystko
//sprawdzam w realtions w jaki folderze sa dane dzwieki 


//play sound (soundId)
//queue


//search


io.on('connection', (socket) => { 
    console.log('User connected:', socket.id)
    onlineUsers.push(socket.id)

    //send new sounds to connected users
    //new-sound

    //inform others about playing sound 
    //gratis


    socket.on('disconnect', () => {
        console.log('User disconnected')

        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    })
})

server.listen(3000, () => {
    console.log('Listening on localhost:3000')
})