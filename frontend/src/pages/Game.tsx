import { useEffect } from 'react';
import Button from '../components/Button';
import CurrentCardsDisplay from '../components/CurrentCardsDisplay';
import GlassTapListener from '../components/GlassTapListener';
import HandsInfo from '../components/HandsInfo';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import useStore from '../store';

// Page displayed during active game
function Game() {
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

  return (
    <div className="w-screen h-screen bg-brand-1 text-brand-2 font-mono grid grid-rows-3">

      <CurrentCardsDisplay />

      <HandsInfo />

      <div className="border-t-4 border-solid border-brand-1-dark grid grid-cols-3 gap-1 bg-brand-1-dark">
      
        <Section>
          <SectionHeading>
            You are
          </SectionHeading>
          <p className="text-xl font-bold">
            {logic.flags.join(', ') || 'normal player'}
          </p>
        </Section>

        <Section>
          <SectionHeading>
            Next Card
          </SectionHeading>
          <p className="text-xl font-bold">
            {cards.nextCard === "desk" ? "On desk" : `Player ${cards.nextCard}`}
          </p>
        </Section>

        <Section>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => {
              socket?.emit('revert-card')
            }}>
              Revert card {glassMode && ' (tap)'}
            </Button>
            <Button color="red-500" onClick={() => {
              socket?.emit('stop')
            }}>
              Stop game {glassMode && ' (double tap)'}
            </Button>
          </div>
        </Section>

      </div>

    </div>
  );
}

export default Game;
