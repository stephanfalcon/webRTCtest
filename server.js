const express = require('express')
const { createServer } = require('http')
const { Server } = require("socket.io");


const app = express()

const httpServer = createServer(app);

const io = new Server(httpServer, { /* options */ });

const {v4:uuidv4} = require('uuid')

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/',(req,res)=>{
  res.redirect(`/${uuidv4()}`)
})

app.get('/:room',(req,res)=>{
  res.render ('room',{roomId:req.params.room})
})

io.on('connection',socket => {
  socket.on('join-room', (roomId,userId)=>{
    socket.join(roomId)
    socket.to(roomId).emit('user-connected',userId)
    socket.on('disconnect',()=>{
      console.log('roomId',roomId)
      socket.to(roomId).emit('user-disconnected',userId)
    })
  })

})

httpServer.listen(3000)