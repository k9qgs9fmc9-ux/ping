import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './features/chat/chatSlice';
import lifeTimelineReducer from './features/lifeTimeline/lifeTimelineSlice';
import hairstyleReducer from './features/hairstyle/hairstyleSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    lifeTimeline: lifeTimelineReducer,
    hairstyle: hairstyleReducer,
  },
});
