const http = require('http');
const express = require('express');

const app = express();
const votes = {};

app.use(express.static('public'));

app.get('/', (req, res)=> {
  res.sendFile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 3000;
const server = http.createServer(app)
                 .listen(port, () => {
                    console.log(`Listening on port ${port}.`);
                  });

const socketIo = require('socket.io');
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  // socket.emit('message', votes[socket.id]);

  socket.on('disconnect', () => {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    console.log(votes);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });


  socket.on('message', (channel, message) => {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      socket.emit('voteCount', countVotes(votes));
    }
  });
});

const countVotes = (votes) => {
  const voteCount = {
      A: 0,
      B: 0,
      C: 0,
      D: 0
  };

  for (let vote in votes) {
    voteCount[votes[vote]]++
  }

  return voteCount;
}

module.exports = server;
