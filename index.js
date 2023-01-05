const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const morgan = require("morgan")
const bodyParser = require('body-parser');
dotenv.config(path.join(__dirname, `.env2`));
const ejs = require('ejs')
const indexRouter = require('./app/router/index');
const fs = require('fs');
//const { post } = require('./app/router/index');
const db = require('./app/config/db');
var multer = require('multer');
var events = require('events');
const socket = require("socket.io");
const ChatModel = require('./app/models/Chats');
//var socket = require('socket.io');
//const { Server } = require('http');


//var upload = multer({dest:"./uploads/"});

// SET STORAGE
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/images/')
//     },
//     filename: function (req, file, cb) {
//       const ext = file.mimetype.split("/")[1];
//       cb(null, file.originalname.split('.')[0] + '_' + Date.now()+"."+ext)
//     }
//   })
 
// var upload = multer({ storage: storage })

var app = express();
const port = process.env.PORT||4000

// console.log(path.join(__dirname, `.env2.${process.env.PORT}`))
//console.log(path.join(__filename))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//var type = upload.single('file');

// for parsing multipart/form-data
//app.use(upload.array()); // to send multipart/form-data
app.use(express.static('public/images'));
app.use(express.static('uploads/images'));

app.use(cors());

var date = new Date().toJSON()
//console.log(date)
var accessLogStream = fs.createWriteStream(path.join(__dirname, `logs/access.log`),{ flags: 'a' })

app.use(morgan('combined', {stream: accessLogStream}));

app.set("view engine", "ejs")
// app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'app/views')]); // It works
app.set('views', [path.join(__dirname, 'app/views')]);//It also works for me

app.use('/hello', (req, res) => {
    res.send("hello")
})

app.get('/home', (req, res) => {
    res.render('home')
})

app.use('/chat', (req, res) => {
    res.render('chat')
});

app.get('/', (req, res) => {
    res.render('index', {firstName:"shankar", lastName:"Kundi"})
})

app.use('/api/users', (req, res) => {
    const {name, email} = req.body;
    res.send(name + ", "+ email)
})

db.connectToMongoDb();

const posts = [
    {title: 'Title 1', body: 'Body 1' },
    {title: 'Title 2', body: 'Body 2' },
    {title: 'Title 3', body: 'Body 3' },
    {title: 'Title 4', body: 'Body 4' },
]
const url = 'https://dummyjson.com/products';
app.get('/api/products', (req, res) => {
    fetch(url)
    .then(response => response.json())
    .then(data => 
        //res.send(data.products)
        res.render('products', {
            articles: data.products
        })
    );
    //console.log(data);
    //res.send("Hello all products")
})

app.use('/api', indexRouter)
//app.post('/api/upload-image', upload.single("image"), function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    //var tmp_path = req.file.path;
    //var target_path = './public/images/' + req.file?.originalname;
    //var dest = fs.createWriteStream(target_path);
    // src.pipe(dest);
    // src.on('end', function() { res.render('complete'); });
    // src.on('error', function(err) { res.render('error'); });
//     console.log(req.file, req.body);
//     res.send({img: req.file, fields: req.body})
//  });

//IIFE (Immedietely Invoke function expressions)
// (function () {
//     console.log("Hello")
//   })()
// var eventEmitter = new events.EventEmitter();

// eventEmitter.on('hello', function(){
//     console.log("Hello world events")
// });

//eventEmitter.emit('hello')

var server = app.listen(port, () => console.log(`Server started at port : ${port}`));

// Socket setup
const io = socket(server);

io.on("connection", function(socket){
    var userName;
    socket.on('joining_chat',(data)=>{
        // console.log(data.username)
        userName = data.username;
        console.log("User " + userName + " : " + socket.id);
         io.emit('joining_chat',{username: data.username})
         
         socket.on("disconnect", () => {
            //console.log("User " + userName + " disconneted : " + socket.id); // undefined
            io.emit('left_chat',{username: data.username})
          });
         
     })

     
    //socket.emit('firstchat', {message:"Hello welcome to chat!!"})
    socket.on('chatMessage', (data)=> {
        //console.log(userName)
        // if(userName == data.userName){
        //     io.emit('chatMessage',{message: data.message, userName: "You"})
        // }else{
        //     io.emit('chatMessage',{message: data.message, userName: data.userName})
        // }
        var userData = new ChatModel({message: data.message, username: data.userName})
        userData.save((err, result) => {
            if(err) throw err;
            console.log("Data inserted successfully - " + result.id)
        });
        io.emit('chatMessage',{message: data.message, userName: data.userName})
        
    })

    // socket.on('exitChat', (data)=> {
    //     console.log(data.userName)
    //     // io.emit('chatMessage',{message: data.message, userName: data.userName})
    //     socket.on("disconnect", () => {
    //         //console.log("User " + userName + " disconneted : " + socket.id); // undefined
    //         io.emit('left_chat',{username: data.userName})
    //       });
    // })

async function getPosts(){
   return fetch(url)
}

//console.log(getPosts().then((data)=> data.json()).then(data1 => console.log(data1.products)));
    
});







