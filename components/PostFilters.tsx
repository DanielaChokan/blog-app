"use client";

import { setFilter } from "@/store/slices/postsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import styles from "./PostFilters.module.css";

export default function PostFilters() {
    const dispatch = useAppDispatch();
    const filter = useAppSelector((s) => s.posts.filter);

    return (
        <div className={styles.wrapper}>
            <input
                value={filter}
                onChange={(e) => dispatch(setFilter(e.target.value))}
                placeholder="Search by title or author"
                className={styles.input}
            />
        </div>
    );
}
