import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import ocrReducer from "../features/OCR/ocrSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const rootReducer = combineReducers({
  user: userReducer,
  ocr: ocrReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // persist only user slice, add ocr if needed
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
