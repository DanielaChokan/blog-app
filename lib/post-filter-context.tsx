"use client";
 
import { createContext, useContext, useState, ReactNode } from "react";
 
interface PostFilterContextValue {
    filter: string;
    setFilter: (value: string) => void;
}
 
const PostFilterContext = createContext<PostFilterContextValue>({
    filter: "",
    setFilter: () => {},
});
 
export function PostFilterProvider({ children }: { children: ReactNode }) {
    const [filter, setFilter] = useState("");
    return (
        <PostFilterContext.Provider value={{ filter, setFilter }}>
            {children}
        </PostFilterContext.Provider>
    );
}
 
export function usePostFilterContext() {
    return useContext(PostFilterContext);
}
