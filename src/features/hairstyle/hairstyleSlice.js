import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateHairstyle } from '../../services/hairstyleService';

// Async thunk to generate hairstyle from uploaded image
export const generateHairstyleAsync = createAsyncThunk(
  'hairstyle/generateHairstyle',
  async ({ imageBase64, prompt, style, apiKey, baseUrl }, { rejectWithValue }) => {
    try {
      return await generateHairstyle({ imageBase64, prompt, style, apiKey, baseUrl });
    } catch (error) {
      console.error('Hairstyle Generation Error:', error);
      return rejectWithValue(error.message || error.toString());
    }
  }
);

const initialState = {
  originalImage: null,
  generatedImages: [], // array of { id, url, prompt, style }
  currentIndex: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const hairstyleSlice = createSlice({
  name: 'hairstyle',
  initialState,
  reducers: {
    setOriginalImage: (state, action) => {
      state.originalImage = action.payload;
    },
    nextImage: (state) => {
      if (state.generatedImages.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.generatedImages.length;
      }
    },
    prevImage: (state) => {
      if (state.generatedImages.length > 0) {
        state.currentIndex = (state.currentIndex - 1 + state.generatedImages.length) % state.generatedImages.length;
      }
    },
    switchToImage: (state, action) => {
      state.currentIndex = action.payload;
    },
    clearAll: (state) => {
      state.originalImage = null;
      state.generatedImages = [];
      state.currentIndex = 0;
      state.status = 'idle';
      state.error = null;
    },
    removeGeneratedImage: (state, action) => {
      const index = action.payload;
      state.generatedImages.splice(index, 1);
      if (state.generatedImages.length === 0) {
        state.currentIndex = 0;
      } else if (state.currentIndex >= state.generatedImages.length) {
        state.currentIndex = state.generatedImages.length - 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateHairstyleAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(generateHairstyleAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.generatedImages.push({
          id: Date.now(),
          ...action.payload
        });
        state.currentIndex = state.generatedImages.length - 1;
      })
      .addCase(generateHairstyleAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setOriginalImage,
  nextImage,
  prevImage,
  switchToImage,
  clearAll,
  removeGeneratedImage
} = hairstyleSlice.actions;

export default hairstyleSlice.reducer;
