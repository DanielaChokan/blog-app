"use client";

import { PropsWithChildren, useState } from "react";
import { Provider } from "react-redux";
import { createAppStore, type AppStore } from "./index";
import { Post, PostWithComments } from "@/types/blog";

type StoreProviderProps = PropsWithChildren<{
	initialPosts: Post[];
	initialSelectedPost?: PostWithComments | null;
}>;

export function StoreProvider({
  children,
  initialPosts,
  initialSelectedPost = null,
}: StoreProviderProps) {
  const [store] = useState<AppStore>(() =>
    createAppStore({
      posts: {
        posts: initialPosts,
        selectedPost: initialSelectedPost,
        loading: false,
        error: null,
        filter: "",
      },
    })
  );

  return <Provider store={store}>{children}</Provider>;
}