import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import slices
import userSlice from './slices/userSlice';
import organizationSlice from './slices/organizationSlice';
import eventsSlice from './slices/eventsSlice';
import verificationSlice from './slices/verificationSlice';
import authSlice from './slices/authSlice';

// Persist configuration
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user', 'auth', 'organization'], // Only persist these slices
};

// Root reducer
const rootReducer = {
    user: userSlice,
    organization: organizationSlice,
    events: eventsSlice,
    verification: verificationSlice,
    auth: authSlice,
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    devTools: __DEV__,
});

// Create persistor
export const persistor = persistStore(store);

// Export store and persistor
export { store, persistor }; 