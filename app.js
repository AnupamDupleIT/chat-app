// app.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://tshivam:shivam1234@owonto.gc1vyas.mongodb.net/test?retryWrites=true&w=majority";
const uri = "mongodb+srv://anupam:Password123.@cluster0.d3fot8v.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.get('/', (req, res) => {
  res.render('video2',{name:req.query.name});
});
app.get('/chat', (req, res) => {
  res.render('new',{name:req.query.name});
});

app.post('/login', (req, res) => {

  console.log("======",req.body)
  //  
 const {email,pasword} = req.body
 if(email==='8103'){
 return  res.render('new',{name:"Anisha"});
 }
 else if(email==='7814'){
 return res.render('new',{name:"Anupam"});
 }
 else{
 return  res.render('new',{name:"Someone"});
 }
 
});


io.on('connection', (socket) => {
  console.log('A user connected');
const now = new Date();

const options = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
};

const formattedDate = now.toLocaleString('en-US', options);
  io.emit('user-joined', `<p class="notification">someone joinned the group chat<time>${formattedDate}</time></p>`);
  
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('selectVideo', function(videoId) {
    io.emit('playVideo', videoId);
  });
  io.on('disconnect', function () {
    io.emit('user-joined', `<p class="notification">someone exited the group chat <time>${formattedDate}</time></p>`);

  })
});

http.listen(3000, () => {
  console.log('Server started on port 3000');
});
