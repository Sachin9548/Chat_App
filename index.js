const express = require('express');
const chats = require('./data/data.js');
const ConnectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const path =require('path');
// const { notFound, errorHandler } = require('./middlewares/errorMiddleWare.js');

const cors=require("cors");

const app = express();

app.use(express.json()); 
app.use(cors());

ConnectDB(); 



app.use('/api/user', userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

// deployment
const __dirname1=path.resolve();
const NODE_ENV='production';
if(NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname1,'/client/dist')));
  app.get('*',(req,res)=>{
res.sendFile(path.resolve(__dirname1,'client','dist','index.html'));
  });
}else{ 
  app.get('/', (req, res) => {
    res.send('Hellow World From server js'); 
  });
}

// deployment

//error handleing
// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, (req, res) => {
  console.log(`Server is Runing ON  Port ${PORT}`);
});
// socket.io
const io = require('socket.io')(server,{
  // cors:{
  //   origin:"frountendurl"
  // }
  // all to all origin
  pingTimeout:60000,
  cors:{
    origin:"*"
  }
});

io.on('connection',(socket)=>{
  console.log('New User Connected');
  socket.on('setup',(userData)=>{
    socket.join(userData._id);
    // console.log('User setup Joined',userData._id);
    socket.emit('connected');
  });
  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log('user join room'+room);
  });

  socket.on("typing",(room)=>{
    socket.in(room).emit("typing");
  })

  socket.on("stop typing",(room)=>{
    socket.in(room).emit("stop typing");
  })

  socket.on('new message',(newmessageResivied) => {
    // console.log('new message',newmessageResivied);
    let chat = newmessageResivied.chat;
    if(!chat.users){
      console.log('no user in chat');
      return;
    }
      chat.users.forEach((user)=>{
        if(user._id==newmessageResivied.sender._id){
          return;
        }
        socket.in(user._id).emit('message recieved',newmessageResivied);
      })

  })
  socket.off("setup",()=>{
    console.log('user disconnected');
    socket.leave(userData._id);
  })
})