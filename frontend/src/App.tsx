import React, { useEffect } from 'react';
import CurrentCardsDisplay from './components/CurrentCardsDisplay';
import Game from './pages/Game';
import Start from './pages/Start';
import useStore from './store';

function App() {
  const page = useStore(state => state.page);
  const setCards = useStore(state => state.setCards);

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
  }, []);

  switch (page) {
    case 'start':
      return <Start />;
    case 'game':
      return <Game />;
    default:
      return (<div>Invalid State: Page is unknown</div>)
  }
}

export default App;
