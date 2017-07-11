const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

require('dotenv').config()


const PORT = process.env.PORT || 3001;
server.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});

// socket = io.listen(server);

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


let socketIds = [];

io.sockets.on('connection', (socket) => {
  socketIds.push(socket.id);
  console.log(socketIds)
  console.log('connected');
  socket.on('message', function(msg, msg2){
    console.log('message: ' + msg, msg2);
  });
socket.on('disconnect', (socket) => {
  console.log('disconnect ', socket.id);
  socketIds = socketIds.filter((val) => {
    return (val !== socket.id)
  })
  console.log(socketIds)
})
socket.on('audio', (data) => {
  const translationController = require('./controllers/translationController');
  console.log(data);
  translationController.recognize(data);
})
  socket.on('send', (message) => {
    let testSocket = socketIds.filter((val) => {
    return (val !== socket.id)
  })
    console.log('testing, should send to: ', testSocket[0], 'message: ', message);
    socket.broadcast.emit('translatedResponse', message);
  });
  socket.on('received', () => {
    socket.broadcast.emit('received');
  })
})

const translationRoute = require('./routes/translationRoute');
app.use('/translation', translationRoute);

app.get('/', function(req, res) {
  res.sendFile(__dirname + 'client/build/index.html');
});

/* handling 404 */
app.get('*', function(req, res) {
  res.status(404).send({message: 'Oops! Not found.'});
});