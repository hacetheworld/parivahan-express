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

  speak(text) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLanguage;
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

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
