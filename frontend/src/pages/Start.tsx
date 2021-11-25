import { useEffect } from 'react';
import Button from '../components/Button';
import CurrentCardsDisplay from '../components/CurrentCardsDisplay';
import GlassTapListener from '../components/GlassTapListener';
import useStore from '../store';

// Page displayed before starting a round
function Start() {
  const isEnrolled = useStore(state => state.isEnrolled);
  const setIsEnrolled = useStore(state => state.setIsEnrolled);
  const numPlayers = useStore(state => state.numPlayers);
  const setPlayerCount = useStore(state => state.setPlayerCount);
  const setPage = useStore(state => state.setPage);
  const socket = useStore(state => state.socket);
  const glassMode = useStore(state => state.mode) === "glass";

  const startGame = () => {
    socket?.emit('start');
    setPage("game");
  };
  const joinGame = () => {
    socket?.emit('join');
    setIsEnrolled(true);
    setPlayerCount(numPlayers + 1);
  };
  const leaveGame = () => {
    socket?.emit('leave');
    setIsEnrolled(false);
  }

  useEffect(() => {
    const gtl = new GlassTapListener(() => {
      if (isEnrolled) {
        startGame();
      } else {
        joinGame();
      }
    }, () => {
      if (isEnrolled) {
        leaveGame();
      }
    });
    gtl.setAsCurrentListener();
  }, [setPage, isEnrolled, startGame]);

  let action = (
    <Button onClick={() => {
      joinGame();
    }}>
      Register as next player in the round {glassMode && ' (tap)'}
    </Button>
  )
  if (isEnrolled) {
    action = (
      <>
        <p>
          You are enrolled in the round.
        </p>

        <Button onClick={() => {
          startGame();
        }}>
          Start the round {glassMode && ' (tap)'}
        </Button>
        <Button color="red-500" className="mt-5" onClick={() => {
          leaveGame();
        }}>
          Leave round {glassMode && ' (double tap)'}
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
