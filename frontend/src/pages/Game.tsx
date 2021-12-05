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
    <div className="w-screen h-screen bg-brand-1 text-brand-2 font-mono grid grid-rows-4">

      <CurrentCardsDisplay />

      <HandsInfo />

      <div className="border-t-4 border-solid border-brand-1-dark grid grid-cols-4 gap-1 bg-brand-1-dark z-10">
      
        <Section>
          <SectionHeading>
            You are
          </SectionHeading>
          <p className="text-3xl font-bold">
            {cards.nextCard === -1 ? (
              <span>
                {logic.isWinner ? 'Winner' : 'Loser haha lol'}
              </span>
            ) : (
              <span>
                {logic.name}
              </span>
            )}
          </p>
        </Section>

        <Section>
          <SectionHeading>
            Pokerscore ™️©(Patented by Daniel Spannbauer Inc. GmbH Ltd. Ltd.)
          </SectionHeading>
          <p className="text-3xl font-bold">
            {Math.round(logic.pokerScore)}
          </p>
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
