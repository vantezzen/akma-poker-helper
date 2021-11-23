import React, { useEffect, useState } from 'react';
import CurrentCardsDisplay from './components/CurrentCardsDisplay';
import RotationInfo from './components/RotationInfo';
import Game from './pages/Game';
import Start from './pages/Start';
import { io } from 'socket.io-client';
import useStore from './store';
import CantJoin from './pages/CantJoin';

function App() {
  const page = useStore(state => state.page);
  const isEnrolled = useStore(state => state.isEnrolled);

  const setCards = useStore(state => state.setCards);
  const setSocket = useStore(state => state.setSocket);
  const setPlayerCount = useStore(state => state.setPlayerCount);
  const setPage = useStore(state => state.setPage);

  useEffect(() => {
    setCards({
      desk: [
        {
          suit: 'hearts',
          rank: "3"
        },
        {
          suit: 'spades',
          rank: "K"
        },
        {
          suit: 'diamonds',
          rank: "10"
        }
      ],
      hand: [
        {
          suit: 'clubs',
          rank: 'A'
        },
        {
          suit: 'clubs',
          rank: 'K'
        }
      ]
    });

    const socket = io(':3001');
    setSocket(socket);
    socket.on('players', (players) => {
      console.log('Socket: Got player count', players);
      setPlayerCount(players);
    });
    socket.on('isRunning', (isRunning) => {
      const enrolled = useStore.getState().isEnrolled;
      console.log('Socket: Got is running', isRunning, enrolled);
      if (isRunning) {
        setPage(enrolled ? 'game' : 'cantjoin');
      } else {
        setPage('start');
      }
    });
  }, []);

  let pageContent = (<div>Invalid State: Page is unknown</div>);
  switch (page) {
    case 'start':
      pageContent = <Start />;
      break;
    case 'game':
      pageContent = <Game />;
      break;
    case 'cantjoin':
      pageContent = <CantJoin />
      break;
  }

  return (
    <>
      <RotationInfo />
      {pageContent}
    </>
  );
}

export default App;
