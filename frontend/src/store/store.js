import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import certicatesReducer from "../features/certificates/certificatesSlice";
import userCertificatesReducer from "../features/certificates/userCertificatesSlice";
import allCertificatesReducer from "../features/certificates/allCertificatesSlice";
import revokedCertificatesReducer from "../features/certificates/revokedCertificatesSlice";
import userManagementReducer from "../features/user/userManagementSlice";
import verificationReducer from "../features/certificates/verificationSlice";
import schoolReducer from "../features/school/schoolSlice";
import organizationReducer from "../features/organization/organizationSlice";
import organizationAuthReducer from "../features/organizationAuth/organizationAuthSlice";
import eventsReducer from "../features/events/eventsSlice";
import verificationRequestsReducer from "../features/verification/verificationSlice";
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
  userManagement: userManagementReducer,
  verification: verificationReducer,
  school: schoolReducer,
  organization: organizationReducer,
  organizationAuth: organizationAuthReducer,
  events: eventsReducer,
  verificationRequests: verificationRequestsReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "organizationAuth"], // persist user and organizationAuth slices
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
