/**
 * Web Audio API based synthesizers for cute dynamic sound effects
 * This avoids external asset loading issues and plays instantly!
 */

export const playMeowSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // Create nodes
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    // Triangle wave for cute main body
    osc1.type = "triangle";
    // Sawtooth with low gain for reedy "cat vocal" harmonic texture
    osc2.type = "sawtooth";
    
    // Pitch bending (me-o-w)
    // Starting frequency of 390Hz, rises to 790Hz, decays to 540Hz
    osc1.frequency.setValueAtTime(390, now);
    osc1.frequency.exponentialRampToValueAtTime(790, now + 0.12);
    osc1.frequency.exponentialRampToValueAtTime(540, now + 0.35);
    
    osc2.frequency.setValueAtTime(390, now);
    osc2.frequency.exponentialRampToValueAtTime(790, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(540, now + 0.35);
    
    // Bandpass filter to model the mouth/formant transition
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(1900, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(1300, now + 0.35);
    filter.Q.setValueAtTime(1.8, now);
    
    // Volume envelope (Attack, Decay, Sustain, Release)
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.22, now + 0.08); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.14, now + 0.22); // Sustain-ish
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.42); // Release
    
    // Oscillator mixers
    const osc1Gain = ctx.createGain();
    const osc2Gain = ctx.createGain();
    osc1Gain.gain.setValueAtTime(0.85, now);
    osc2Gain.gain.setValueAtTime(0.15, now);
    
    // Route signals
    osc1.connect(osc1Gain);
    osc2.connect(osc2Gain);
    
    osc1Gain.connect(filter);
    osc2Gain.connect(filter);
    
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Start play
    osc1.start(now);
    osc2.start(now);
    
    // Stop play
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  } catch (error) {
    console.warn("Web Audio API meow play failed:", error);
  }
};
