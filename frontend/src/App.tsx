import React, { useEffect } from 'react';
import CurrentCardsDisplay from './components/CurrentCardsDisplay';
import RotationInfo from './components/RotationInfo';
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

  let pageContent = (<div>Invalid State: Page is unknown</div>);
  switch (page) {
    case 'start':
      pageContent = <Start />;
      break;
    case 'game':
      pageContent = <Game />;
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
