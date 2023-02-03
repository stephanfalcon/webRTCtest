const express = require('express')
const { createServer } = require('http')
const { Server } = require("socket.io");
const {ExpressPeerServer} = require('peer')

const port = process.env.PORT || 3000

const app = express()

const httpServer = createServer(app);

const server = httpServer.listen(port,()=>{
  console.log(`running on port ${port}`)
})

const io = new Server(httpServer);

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
  console.log("new connection from io")
  socket.on('join-room', (roomId,userId)=>{
    console.log('user joined room')
    socket.join(roomId)
    socket.to(roomId).emit('user-connected',userId)
    socket.on('disconnect',()=>{
      console.log('roomId',roomId)
      socket.to(roomId).emit('user-disconnected',userId)
    })
  })

})

app.use('/peer', ExpressPeerServer(server, {
	debug: true
}))