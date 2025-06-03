import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import certicatesReducer from "../features/certificates/certificatesSlice";
import userCertificatesReducer from "../features/certificates/userCertificatesSlice";
import allCertificatesReducer from "../features/certificates/allCertificatesSlice";
import revokedCertificatesReducer from "../features/certificates/revokedCertificatesSlice";
import userManagementReducer from "../features/user/userManagementSlice"; // Add this import
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
  certificates: certicatesReducer,
  userCertificates: userCertificatesReducer,
  allCertificates: allCertificatesReducer,
  revokedCertificates: revokedCertificatesReducer,
  userManagement: userManagementReducer, // Add this line
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // persist only user slice
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
