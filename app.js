// app.js

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
  res.render('index',{name:req.query.name});
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
 
  
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('Server started on port 3000');
});
