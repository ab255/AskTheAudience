const socket = io();

const connectionCount = document.getElementById('connection-count');
const statusMessage = document.getElementById('status-message');
const buttons = document.querySelectorAll('#choices button');
const votesMessage = document.getElementById('total-votes')
const individualVote = document.getElementById('current-vote')

socket.on('usersConnected', (count) => {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', (message) => {
  statusMessage.innerText = message;
});

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    socket.send('voteCast', this.innerText);
    individualVote.innerText = 'Your current vote is ' + this.innerText
  });
}

// socket.on('initialState', (votes) => {
//   console.log(votes);
//   votesMessage.innerText = 'A: ' + votes[0] + '  B: ' + votes[1] + '  C: ' + votes[2] + '  D: ' + votes[3]
// });

socket.on('voteCount', (votes) => {
  votesMessage.innerText = 'A: ' + votes.A + '  B: ' + votes.B + '  C: ' + votes.C + '  D: ' + votes.D
});
