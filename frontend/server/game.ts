import { Socket } from "socket.io";

export default class Game {

  players: Socket[] = [];

  isRunning = false;

  broadcast(event: string, data: any) {
    this.players.forEach(player => player.emit(event, data));
  }
}