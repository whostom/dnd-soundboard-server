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

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(basePath, 'profiles'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const fileName = new uuidv4()
    cb(null, fileName + ext)
  }
})

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


const uploadProfile = multer({ storage: profileStorage })
const uploadSound = multer({ storage: soundStorage })

const io = new Server(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

app.use(cors())

app.post('/update-profile', uploadProfile.single('profilePicture'), (req, res) => {
    const userId = req.body.userId
    const serverProfileName = req.file.filename

    if (!userId || !profilePicture) {
        return res.status(400).json({ error: 'Missing userId or profilePicture' })
    }

    Database.UpdateProfile(userId, serverProfileName)
        .then((result) => {
            res.status(200).json({ success: true, result });
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to update profile' })
        })
})

app.post('/upload-sound', uploadSound.single('soundFile'), (req, res) => {
    const userId = req.body.userId
    const soundName = req.file.originalname
    const serverSoundName = req.file.filename

    //add database record
})


io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('register-user', ({ username, password, email }) => {
        Database.RegisterUser(username, password, email)
            .then(() => {
                socket.emit('register-success', 'User added successfully')
            })
            .catch(() => {
                socket.emit('register-failure', 'Error adding user')
            })
    })

    socket.on('login-user', ({ username, hashedPassword, email }) => {
        Database.LoginUser(username, hashedPassword, email)
            .then(({ user, token }) => {
                socket.emit('login-success', { user, token })
                console.log('User logged in:', user.user_id, socket.id)
            })
            .catch(() => {
                socket.emit('login-failure', 'User login failure')
            })
    })

    //add sound

    //play sound

    //inform others about playing sound

    //queue

    

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