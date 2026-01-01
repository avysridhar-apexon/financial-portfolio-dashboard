import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { portfolioSlice } from "../features/portfolio/portfolioSlice";

// create root reducer from various slices
const rootReducer = combineSlices(portfolioSlice);
// infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

// this store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

// Actual App store.
export const store = makeStore();

// Infer the type of `store`
export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
