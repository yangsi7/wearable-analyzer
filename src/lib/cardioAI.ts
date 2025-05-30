import { useConversation, ConversationStatus, ConversationOptions } from '@11labs/react';

export const CARDIO_AI_AGENT_ID = 'IUYmGRbdis9xqSciJKcg';

export interface CardioAIState {
  status: ConversationStatus;
  isSpeaking: boolean;
  isListening: boolean;
  transcript: string;
  lastResponse: string;
  error: string | null;
}

export function useCardioAI(
  onStateChange?: (state: CardioAIState) => void,
  options?: Partial<ConversationOptions>
) {
  const defaultOptions: ConversationOptions = {
    onConnect: () => {
      console.log('Connected to CardioAI');
      onStateChange?.({
        status: 'connected',
        isSpeaking: false,
        isListening: false,
        transcript: '',
        lastResponse: '',
        error: null
      });
    },
    onDisconnect: () => {
      console.log('Disconnected from CardioAI');
      onStateChange?.({
        status: 'disconnected',
        isSpeaking: false,
        isListening: false,
        transcript: '',
        lastResponse: '',
        error: null
      });
    },
    onError: (error) => {
      console.error('CardioAI error:', error);
      onStateChange?.({
        status: 'error',
        isSpeaking: false,
        isListening: false,
        transcript: '',
        lastResponse: '',
        error: error.message
      });
    },
    onTranscript: (transcript) => {
      onStateChange?.({
        status: 'connected',
        isSpeaking: false,
        isListening: true,
        transcript,
        lastResponse: '',
        error: null
      });
    },
    onSpeechStart: () => {
      onStateChange?.({
        status: 'connected',
        isSpeaking: true,
        isListening: false,
        transcript: '',
        lastResponse: '',
        error: null
      });
    },
    onSpeechEnd: () => {
      onStateChange?.({
        status: 'connected',
        isSpeaking: false,
        isListening: true,
        transcript: '',
        lastResponse: '',
        error: null
      });
    },
    onMessage: (message) => {
      onStateChange?.({
        status: 'connected',
        isSpeaking: true,
        isListening: false,
        transcript: '',
        lastResponse: message,
        error: null
      });
    }
  };

  return useConversation({
    ...defaultOptions,
    ...options
  });
}