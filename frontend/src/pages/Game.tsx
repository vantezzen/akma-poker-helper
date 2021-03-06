import { useEffect } from 'react';
import { LogOut, RotateCcw, Square } from 'react-feather';
import Button from '../components/Button';
import CurrentCardsDisplay from '../components/CurrentCardsDisplay';
import GlassTapListener from '../components/GlassTapListener';
import HandsInfo from '../components/HandsInfo';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import useStore from '../store';

// Page displayed during active game
function Game() {
  const state = useStore();
  const cards = useStore(state => state.cards);
  const logic = useStore(state => state.logic);
  const socket = useStore(state => state.socket);
  const glassMode = useStore(state => state.mode) === "glass";

  useEffect(() => {
    const gtl = new GlassTapListener(() => {
      socket?.emit('revert-card')
    }, () => {
      socket?.emit('stop')
    });
    gtl.setAsCurrentListener();
  }, [socket]);

  let currentState = "";
  if (cards.nextCard === -1) {
    if (logic.isWinner) {
      currentState = "Winner";
    } else if (logic.hasTied) {
      currentState = "Tied";
    } else {
      currentState = "Loser";
    }
  } else if (state.hasFolded) {
    currentState = "Folded";
  } else {
    currentState = "Player #" + state.playerNumber;
  }

  return (
    <div className="w-screen h-screen bg-brand-1 text-brand-2 font-mono grid grid-rows-4">

      <CurrentCardsDisplay />

      <HandsInfo />

      <div className="border-t-4 border-solid border-brand-1-dark grid grid-cols-4 gap-1 bg-brand-1-dark z-10">
      
        <Section>
          <SectionHeading>
            You are
          </SectionHeading>
          <p className="text-3xl font-bold">
            {currentState}
            {state.cards.status && <div className="text-brand-2 text-base"> ({state.cards.status})</div>}
          </p>
        </Section>

        <Section>
          <SectionHeading>
            Pokerscore
          </SectionHeading>
          <p className="text-3xl font-bold">
            {Math.round(logic.pokerScore)}
          </p>
          <div style={{ width: `${logic.pokerScore}%` }} className='h-6 bg-brand-2 rounded duration-200' />
        </Section>

        <Section>
          <SectionHeading>
            Next Card
          </SectionHeading>
          <p className="text-3xl font-bold">
            {cards.nextCard === "" ? "On desk" : cards.nextCard === -1 ? `No next` : `Player ${cards.nextCard}`}
          </p>
        </Section>

        <Section>
          {state.cards.nextCard == -1 ? (
            <div className="grid grid-cols-2 gap-4 pt-3">
              <Button onClick={() => {
                socket?.emit('stop')
                socket?.emit('start')
              }}>
                Start new round
              </Button>
              <Button color="red-500" onClick={() => {
                socket?.emit('stop')
              }}>
                Stop game {glassMode && ' (double tap)'}
              </Button>
            </div>
          ) : (
            <>
              {!state.hasFolded && (
                <Button onClick={() => {
                  socket?.emit('fold')
                  state.setHasFolded(true)
                }}>
                  <LogOut /> Fold
                </Button>
              )}
              <div className="grid grid-cols-2 gap-4 pt-3">
                <Button onClick={() => {
                  socket?.emit('revert-card')
                }}>
                  <RotateCcw /> Revert card {glassMode && ' (tap)'}
                </Button>
                <Button color="red-500" onClick={() => {
                  socket?.emit('stop')
                }}>
                   <Square /> Stop game {glassMode && ' (double tap)'}
                </Button>
              </div>
            </>
          )}
        </Section>

      </div>

    </div>
  );
}

export default Game;
