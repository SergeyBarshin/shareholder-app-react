import { combineReducers, configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./slices/filterSlice";

const rootReducer = combineReducers({
  filters: filtersReducer,
  // Здесь могут быть другие редьюсеры, если вы их добавите
});

const store = configureStore({
  reducer: {
    appState: rootReducer, // Используем appState, чтобы избежать конфликтов и соответствовать структуре
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
