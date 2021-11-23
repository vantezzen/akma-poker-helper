import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import Game from './game';
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const game = new Game();

app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>Works</h1>');
});

let allSockets: Socket[] = [];
const broadcast = (event: string, data: any) => {
  allSockets.forEach(socket => socket.emit(event, data));
};

io.on('connection', (socket) => {

  socket.on('join', () => {
    game.players.push(socket);

    broadcast('players', game.players.length);
  });
  socket.on('leave', () => {
    game.players = game.players.filter(player => player !== socket);

    broadcast('players', game.players.length);
  });

  socket.on('start', () => {
    console.log('starting game');
    game.isRunning = true;
    broadcast('isRunning', true);
  });
  socket.on('stop', () => {
    console.log('stopping game');
    game.isRunning = false;
    broadcast('isRunning', false);
  });
  socket.on('revert-card', () => {
    console.log('reverting card');
    // TODO
  });

  socket.emit('players', game.players.length);
  socket.emit('isRunning', game.isRunning);

  console.log('a user connected', game);
  allSockets.push(socket);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    allSockets = allSockets.filter(s => s !== socket);
    game.players = game.players.filter(s => s !== socket);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});