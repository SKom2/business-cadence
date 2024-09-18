import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authReducer } from "./auth/auth.slice.ts";
import { calendarsReducer } from "./calendars/calendars.slice.ts";

const rootReducer = combineReducers({
  authReducer,
  calendarsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
