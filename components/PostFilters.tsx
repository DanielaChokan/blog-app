"use client";

import { usePostFilters } from "@/hooks/usePostFilters";
import styles from "./PostFilters.module.css";

export default function PostFilters() {
    const { filter, updateFilter } = usePostFilters();

    return (
        <div className={styles.wrapper}>
            <input
                value={filter}
                onChange={(e) => updateFilter(e.target.value)}
                placeholder="Search by title or author"
                className={styles.input}
            />
        </div>
    );
}
