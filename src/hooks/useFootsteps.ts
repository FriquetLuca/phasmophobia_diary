import { useRef, useEffect, useState } from 'react';

export function useFootsteps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const audioBuffer = useRef<AudioBuffer | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const nextStepTime = useRef(0);
  const strideLength = 0.9;

  useEffect(() => {
    const loadSound = async () => {
      try {
        // Ensure the path is correct (public/audio/ghost_step.mp3)
        const response = await fetch('/audio/ghost_step.mp3');
        if (!response.ok) throw new Error('Audio file not found');

        const arrayBuffer = await response.arrayBuffer();

        // We create a temporary context just to decode the data
        const tempCtx = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const decodedData = await tempCtx.decodeAudioData(arrayBuffer);
        audioBuffer.current = decodedData;
        await tempCtx.close();

        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to load ghost footsteps:', err);
      }
    };
    loadSound();
  }, []);

  const stop = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (audioCtx.current) {
      audioCtx.current.close();
      audioCtx.current = null;
    }
  };

  const playStep = (time: number) => {
    if (!audioCtx.current || !audioBuffer.current) return;

    const source = audioCtx.current.createBufferSource();
    const gain = audioCtx.current.createGain();

    source.buffer = audioBuffer.current;
    // Phasmophobia variation: slightly different pitch each time
    source.playbackRate.value = 0.9 + Math.random() * 0.2;

    gain.gain.setValueAtTime(1.0, time);
    source.connect(gain);
    gain.connect(audioCtx.current.destination);
    source.start(time);
  };

  const play = async (speed: number) => {
    if (!audioBuffer.current) return;

    stop();

    // Initialize AudioContext ONLY after user gesture
    audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();

    // Browsers often start context as 'suspended'
    if (audioCtx.current.state === 'suspended') {
      await audioCtx.current.resume();
    }

    nextStepTime.current = audioCtx.current.currentTime;

    const scheduler = () => {
      if (!audioCtx.current) return;

      while (nextStepTime.current < audioCtx.current.currentTime + 0.1) {
        playStep(nextStepTime.current);
        nextStepTime.current += strideLength / speed;
      }
      timeoutRef.current = window.setTimeout(scheduler, 50);
    };

    scheduler();
  };

  return { play, stop, isLoaded };
}
