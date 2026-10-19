import { useRef, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Volume2 } from 'lucide-react';
import { CharacterCompanion } from './CharacterCompanion';
import { useBridgeAudio } from '../../hooks/useBridgeAudio';
import './readingWorldTour.css';

const GROWN_UP_LINE = 'Ask a grown-up to help.';
// Inline so the 48px child touch target wins over the tour card's 44px button rule.
const TOUCH = { minWidth: 48, minHeight: 48 };
const WIDE_TOUCH = { ...TOUCH, paddingInline: 20 };

interface GrownUpConfirmProps {
  open: boolean;
  question: string;
  children?: ReactNode;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Adult-only confirmation in Milo's tour card; No is on the left and focused first as the safer choice.
export function GrownUpConfirm({ open, question, children, confirmLabel = 'Yes', confirmDisabled = false, busy = false, onConfirm, onCancel }: GrownUpConfirmProps) {
  const audio = useBridgeAudio();
  const noButton = useRef<HTMLButtonElement>(null);
  const cancel = () => { audio.stop(); if (!busy) onCancel(); };
  return <Dialog.Root open={open} onOpenChange={next => { if (!next) cancel(); }}><Dialog.Portal>
    <Dialog.Overlay className="reading-tour-shade"/>
    <Dialog.Content className="reading-tour-panel" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      onOpenAutoFocus={event => { event.preventDefault(); noButton.current?.focus(); }}>
      <div className="reading-tour-copy">
        <div className="reading-tour-guide">
          <CharacterCompanion size={60} state={audio.isPlaying ? 'speaking' : 'idle'}/>
          <Dialog.Description asChild><span>{GROWN_UP_LINE}</span></Dialog.Description>
          <button style={TOUCH} aria-label="Listen to Milo" title="Listen to Milo"
            onClick={() => { audio.stop(); void audio.narrateText({ file: '', text: `${question} ${GROWN_UP_LINE}` }).catch(() => {}); }}><Volume2/></button>
        </div>
        <Dialog.Title>{question}</Dialog.Title>
        {children}
        <footer>
          <button ref={noButton} style={WIDE_TOUCH} onClick={cancel} disabled={busy}>No</button>
          <button className="reading-tour-next" style={WIDE_TOUCH} onClick={() => { audio.stop(); onConfirm(); }} disabled={busy || confirmDisabled}>
            {busy ? 'Please wait...' : confirmLabel}
          </button>
        </footer>
      </div>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}
