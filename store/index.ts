import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./slices/postsSlice";

const rootReducer = {
  posts: postsReducer,
};

export type RootState = {
  posts: ReturnType<typeof postsReducer>;
};

export const createAppStore = (preloadedState?: Partial<RootState>) =>
	configureStore({
		reducer: rootReducer,
		preloadedState: preloadedState as RootState,
	});

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = ReturnType<typeof createAppStore>["dispatch"];