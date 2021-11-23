import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import useStore from '../store';

function CantJoin() {
  const socket = useStore(state => state.socket);
  return (
    <div className="w-screen h-screen bg-brand-1 text-brand-2 font-mono grid grid-rows-3">

      <SectionHeading>
        You can't join the round
      </SectionHeading>
      <p>
        A game is currently running. Please wait for the next round.
      </p>

      <Button color="red-500" onClick={() => {
        socket?.emit('stop')
      }}>
        Force stop game for everyone
      </Button>
    </div>
  );
}

export default CantJoin;
