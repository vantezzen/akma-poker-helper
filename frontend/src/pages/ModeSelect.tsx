import { useEffect } from 'react';
import Button from '../components/Button';
import CurrentCardsDisplay from '../components/CurrentCardsDisplay';
import GlassTapListener from '../components/GlassTapListener';
import useStore from '../store';

// Page displayed before starting a round
function ModeSelect() {
  const setMode = useStore(state => state.setMode);
  const setPage = useStore(state => state.setPage);

  return (
    <div className="w-screen h-screen bg-brand-1 text-brand-2 font-bold font-mono grid grid-cols-2 gap-1">

      <Button onClick={() => {
        setMode('normal');
        setPage('start');
      }}>
        Normal Mode
      </Button>
      <Button onClick={() => {
        setMode('glass');
        document.body.requestFullscreen();
        setPage('start');
      }}>
        Glass Mode
      </Button>

    </div>
  );
}

export default ModeSelect;
