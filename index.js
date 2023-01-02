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

app.listen(port, () => console.log(`Server started at port : ${port}`));