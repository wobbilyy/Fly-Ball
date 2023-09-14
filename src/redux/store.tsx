import { configureStore } from '@reduxjs/toolkit';
import gameStateReducer from './gameStateSlice.tsx';
import sceneReducer from './sceneSlice.tsx';

export const store = configureStore({
  reducer: {
    gameState: gameStateReducer,
    scene: sceneReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware( { serializableCheck: false } ),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
