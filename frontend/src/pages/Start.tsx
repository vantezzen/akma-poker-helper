import Button from '../components/Button';
import CurrentCardsDisplay from '../components/CurrentCardsDisplay';
import useStore from '../store';

// Page displayed before starting a round
function Start() {
  const isEnrolled = useStore(state => state.isEnrolled);
  const setIsEnrolled = useStore(state => state.setIsEnrolled);
  const numPlayers = useStore(state => state.numPlayers);
  const setPlayerCount = useStore(state => state.setPlayerCount);
  const setPage = useStore(state => state.setPage);
  const socket = useStore(state => state.socket);

  let action = (
    <Button onClick={() => {
      socket?.emit('join');
      setIsEnrolled(true);
      setPlayerCount(numPlayers + 1);
    }}>
      Register as next player in the round
    </Button>
  )
  if (isEnrolled) {
    action = (
      <>
        <p>
          You are enrolled in the round.
        </p>

        <Button onClick={() => {
          socket?.emit('start');
          setPage("game");
        }}>
          Start the round
        </Button>
        <Button color="red-500" className="mt-5" onClick={() => {
          socket?.emit('leave');
          setIsEnrolled(false);
        }}>
          Leave round
        </Button>
      </>
    )
  }

  return (
    <div className="w-screen h-screen bg-brand-1 text-brand-2 font-bold font-mono">

      <h1 className="text-center font-black text-xl pt-4">
        Welcome to Akma Poker Helper!
      </h1>

      <p className="text-center text-sm">
        Currently <span className="text-brand-3">{numPlayers}</span> are registered for playing.
      </p>

      <div className="flex flex-col items-center mt-4">
        {action}
      </div>
    </div>
  );
}

export default Start;
