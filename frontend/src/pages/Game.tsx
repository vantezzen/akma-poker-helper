import CurrentCardsDisplay from '../components/CurrentCardsDisplay';

// Page displayed during active game
function Game() {
  return (
    <div className="w-screen h-screen bg-brand-1 text-brand-2 font-mono">

      <CurrentCardsDisplay />

    </div>
  );
}

export default Game;
