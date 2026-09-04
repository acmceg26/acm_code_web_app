import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const GUEST_KEY = 'code_guest_mode';
const DEFAULT_MESSAGE = 'Sign in to access this feature';
const HIDE_DELAY = 2200;

interface PromptState {
  visible: boolean;
  x: number;
  y: number;
  message: string;
}

interface GuestContextType {
  isGuest: boolean;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
  /** Shows a small "sign in to access" bubble next to the cursor/tap. */
  promptSignIn: (message?: string) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGuest, setIsGuest] = useState(() => sessionStorage.getItem(GUEST_KEY) === '1');
  const [prompt, setPrompt] = useState<PromptState>({ visible: false, x: 0, y: 0, message: DEFAULT_MESSAGE });
  // Last known pointer position, kept out of state so tracking it doesn't
  // trigger re-renders — only promptSignIn() needs to read it.
  const pointerRef = useRef({ x: 0, y: 0 });
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const track = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    // pointerdown covers touch taps, which never fire pointermove beforehand.
    window.addEventListener('pointermove', track);
    window.addEventListener('pointerdown', track);
    return () => {
      window.removeEventListener('pointermove', track);
      window.removeEventListener('pointerdown', track);
    };
  }, []);

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const enterGuestMode = useCallback(() => {
    sessionStorage.setItem(GUEST_KEY, '1');
    setIsGuest(true);
  }, []);

  const exitGuestMode = useCallback(() => {
    sessionStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
  }, []);

  const promptSignIn = useCallback((message: string = DEFAULT_MESSAGE) => {
    const { x, y } = pointerRef.current;
    setPrompt({ visible: true, x, y, message });
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setPrompt((p) => ({ ...p, visible: false }));
    }, HIDE_DELAY);
  }, []);

  // Keep the bubble on-screen even when triggered near the viewport edge.
  const left = Math.min(prompt.x + 14, window.innerWidth - 230);
  const top = Math.min(prompt.y + 14, window.innerHeight - 50);

  return (
    <GuestContext.Provider value={{ isGuest, enterGuestMode, exitGuestMode, promptSignIn }}>
      {children}
      {prompt.visible && (
        <div
          aria-live="polite"
          className="fixed z-[100] pointer-events-none px-3 py-1.5 rounded-lg border border-blue-500/40 bg-zinc-900 text-zinc-100 text-xs font-medium shadow-lg shadow-black/30 animate-fade-in-up"
          style={{ left, top }}
        >
          {prompt.message}
        </div>
      )}
    </GuestContext.Provider>
  );
};

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};
