import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MODES, getModeConfig } from '../../data/modes';
import { sendChatRequest } from '../../services/dashscope';

// Async thunk to send message to backend or directly to API
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ messages, apiKey, baseUrl }, { rejectWithValue }) => {
    try {
      return await sendChatRequest({ messages, apiKey, baseUrl });
    } catch (error) {
      console.error('Chat Error:', error);
      return rejectWithValue(error.message || error.toString());
    }
  }
);

const initialMode = MODES.EMOTIONAL;
const initialConfig = getModeConfig(initialMode);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    mode: initialMode,
    messages: [
      { role: 'system', content: initialConfig.systemPrompt }
    ],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: 'user', content: action.payload });
    },
    clearHistory: (state) => {
      const config = getModeConfig(state.mode);
      state.messages = [
        { role: 'system', content: config.systemPrompt }
      ];
    },
    switchMode: (state, action) => {
      const newMode = action.payload;
      const config = getModeConfig(newMode);
      state.mode = newMode;
      // Reset messages with new system prompt
      state.messages = [
        { role: 'system', content: config.systemPrompt }
      ];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addUserMessage, clearHistory, switchMode } = chatSlice.actions;

export default chatSlice.reducer;
