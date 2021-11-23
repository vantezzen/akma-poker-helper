import Button from '../components/Button';
import CurrentCardsDisplay from '../components/CurrentCardsDisplay';
import HandsInfo from '../components/HandsInfo';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import useStore from '../store';

// Page displayed during active game
function Game() {
  const cards = useStore(state => state.cards);
  const socket = useStore(state => state.socket);

  return (
    <div className="w-screen h-screen bg-brand-1 text-brand-2 font-mono grid grid-rows-3">

      <CurrentCardsDisplay />

      <HandsInfo />

      <div className="border-t-4 border-solid border-brand-1-dark grid grid-cols-3 gap-1 bg-brand-1-dark">
      
        <Section>
          <SectionHeading>
            You are
          </SectionHeading>
          <p className="text-3xl font-bold">
            Big Blind
          </p>
        </Section>

        <Section>
          <SectionHeading>
            Next Card
          </SectionHeading>
          <p className="text-3xl font-bold">
            Player 3
          </p>
        </Section>

        <Section>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => {
              socket?.emit('revert-card')
            }}>
              Revert card
            </Button>
            <Button color="red-500" onClick={() => {
              socket?.emit('stop')
            }}>
              Stop game
            </Button>
          </div>
        </Section>

      </div>

    </div>
  );
}

export default Game;
