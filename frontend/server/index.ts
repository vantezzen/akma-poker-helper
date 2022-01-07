import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import MQTT from 'async-mqtt';
import Game from './game';
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let game = new Game();

app.use(cors());

// React Frontend
app.use(express.static(__dirname + '/../build'));

let allSockets: Socket[] = [];
const broadcast = (event: string, data: any) => {
  allSockets.forEach(socket => socket.emit(event, data));
};

const mqtt = MQTT.connect('mqtt://broker.hivemq.com');

// STOCKET.IO LISTENERS
io.on('connection', (socket) => {

  socket.on('join', () => {
    game.players.push(socket);

    socket.emit('playerNum', game.players.length);
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

    mqtt.publish('akma/poker/command/startRound', game.players.length.toString());
  });
  socket.on('stop', () => {
    console.log('stopping game');
    game.isRunning = false;
    broadcast('isRunning', false);

    mqtt.publish('akma/poker/command/endRound', "");
  });
  socket.on('revert-card', () => {
    console.log('reverting card');
    mqtt.publish('akma/poker/command/revertLast', "");
  });
  socket.on('fold', () => {
    console.log('folding player');
    mqtt.publish('akma/poker/command/fold', (game.players.findIndex(player => player === socket) + 1).toString());
  });
  socket.on('reset', () => {
    console.log('resetting game');
    
    mqtt.publish('akma/poker/command/endRound', "");
    game = new Game();
    broadcast('reload', '');
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

// MQTT LISTENERS
mqtt.subscribe('akma/poker/state');
mqtt.subscribe('akma/poker/logic');

mqtt.on("message", function (topic, payload) {
  if (topic.startsWith('akma/poker')) {
    console.log(`received message: ${topic} ${payload}`);
    
    if (topic.endsWith('/state')) {
      const state = JSON.parse(payload.toString());
      console.log('Got state', state);

      for (let i = 0; i < game.players.length; i++) {
        let status = "";
        if (state.smallBlind === (i + 1)) {
          status = "Small Blind";
        } else if (state.bigBlind === (i + 1)) {
          status = "Big Blind";
        }

        game.players[i].emit('state', {
          desk: state.desk || [],
          hand: state.hands && state.hands[i + 1] || [],
          nextCard: state.nextCard || "",
          status,
        });
      }
    } else if (topic.endsWith('/logic')) {
      const logic = JSON.parse(payload.toString());
      console.log('Got logic', logic);
      for (let i = 0; i < game.players.length; i++) {
        game.players[i].emit('logic', logic.player[i]);
      }
    }
  }
})

server.listen(3001, () => {
  console.log('listening on *:3001');
});