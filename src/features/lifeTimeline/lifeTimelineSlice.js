import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { parseDiaryContent } from '../../services/lifeTimelineService';

// Async thunk to parse diary content and generate timeline
export const parseDiary = createAsyncThunk(
  'lifeTimeline/parseDiary',
  async ({ diaryContent, apiKey, baseUrl }, { rejectWithValue }) => {
    try {
      return await parseDiaryContent({ diaryContent, apiKey, baseUrl });
    } catch (error) {
      console.error('Diary Parsing Error:', error);
      return rejectWithValue(error.message || error.toString());
    }
  }
);

const initialState = {
  diaryContent: '',
  timelineEvents: [],
  parsedData: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  videoGenerationStatus: 'idle',
};

const lifeTimelineSlice = createSlice({
  name: 'lifeTimeline',
  initialState,
  reducers: {
    setDiaryContent: (state, action) => {
      state.diaryContent = action.payload;
    },
    clearTimeline: (state) => {
      state.diaryContent = '';
      state.timelineEvents = [];
      state.parsedData = null;
      state.status = 'idle';
      state.error = null;
      state.videoGenerationStatus = 'idle';
    },
    setVideoGenerationStatus: (state, action) => {
      state.videoGenerationStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(parseDiary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(parseDiary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.parsedData = action.payload;
        state.timelineEvents = action.payload.events || [];
      })
      .addCase(parseDiary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setDiaryContent, clearTimeline, setVideoGenerationStatus } = lifeTimelineSlice.actions;

export default lifeTimelineSlice.reducer;
