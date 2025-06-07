const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const Database = require('./Database')
const path = require('path')
const cors = require('cors')

const io = new Server(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

app.use(cors())
app.get('/', (req, res) => {
    res.send("test endpoint")
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


    socket.on('update-profile', ({ loggedUser, profilePicture}) => {
        Database.UpdateProfile(loggedUser, profilePicture)
            .then((result) => {
                socket.emit('update-profile-success', result)
            })
            .catch(err => {
                socket.emit('update-profile-error', 'Failed to update profile')
            })
    })

    

    

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