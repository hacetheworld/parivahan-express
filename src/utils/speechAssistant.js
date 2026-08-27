/**
 * Web Speech API Audio Assistance for Parivahan Express.
 * Provides accessible text-to-speech guidance in English and Hindi for civic applicants.
 */

class SpeechAssistant {
  constructor() {
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.isSpeaking = false;
    this.currentLanguage = 'en-IN'; // Default to Indian English, fallback to 'hi-IN'
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
  }

  /**
   * Picks the best-quality system voice available for the current language,
   * instead of leaving it to whatever generic default the browser falls back
   * to. Favors natural/enhanced engines (e.g. Google's) over robotic defaults.
   */
  pickVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices.length) return null;

    const langPrefix = this.currentLanguage.split('-')[0].toLowerCase();
    const candidates = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
    const pool = candidates.length ? candidates : voices;

    const qualityRank = (v) => {
      const name = v.name.toLowerCase();
      if (name.includes('natural') || name.includes('premium') || name.includes('enhanced')) return 0;
      if (name.includes('google')) return 1;
      if (v.lang.toLowerCase() === this.currentLanguage.toLowerCase()) return 2;
      return 3;
    };

    return [...pool].sort((a, b) => qualityRank(a) - qualityRank(b))[0];
  }

  speak(text) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    // Some browsers (notably Chrome) load the voice list asynchronously; if
    // it isn't ready yet, wait for it once instead of speaking with no voice.
    if (this.synth.getVoices().length === 0) {
      this.synth.onvoiceschanged = () => {
        this.synth.onvoiceschanged = null;
        this.speak(text);
      };
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLanguage;
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    const voice = this.pickVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      this.isSpeaking = false;
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
}

export const speechAssistant = new SpeechAssistant();
