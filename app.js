import express,{json} from "express";
import cors from "cors";
import { config } from "dotenv";
import connection from "./database/connection.js";
import authRoute from "./Routes/AuthRoute.js";
import chatRoute from "./Routes/ChatRoute.js";
import messageRoute from "./Routes/MessageRoute.js";
import formidableMiddleware from "express-formidable"
import morgan from "morgan";
import chat from "./dummyData.js";
import bodyParser from "body-parser";
import  {Server}  from "socket.io";

config();
// MiddleWares
const app = express();

app.use(cors());
app.use(morgan("dev"));

//Configurations

//DataBase connection
connection();

//Routes for this App


app.use("/auth", authRoute);
app.use("/chat", chatRoute);
app.use("/messages", messageRoute);

const server=app.listen(3200, (req, res) => {
  console.log("The server is running on port 3200\n");
});

const io=new Server(server,{
  cors:{
    origin:'https://6562137e09319d419040aebc--resilient-eclair-e17178.netlify.app'
  }
});


io.on('connection',(socket)=>{
 // console.log('socket is connected successfully');

  socket.on('setup',(userData)=>{
    socket.join(userData);
    socket.emit('connected');
  })

  socket.on('join_chat',(room)=>{
    socket.join(room);
    console.log('User has joined this room ' + room);
  })

  socket.on('newMessage',(newMessageRecieved)=>{
    console.log('Message sent');
    var chat= newMessageRecieved.chat;
    chat.users.forEach((user)=>{
      if(user._id==newMessageRecieved.sender_id) return;
      socket.in(chat._id).emit('messageRecieved',newMessageRecieved);
    })
  })
})



