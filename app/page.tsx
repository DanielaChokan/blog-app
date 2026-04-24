export const dynamic = "force-dynamic";
export const revalidate = 0;

import PostFilters from "@/components/PostFilters";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import { PostFilterProvider } from "@/lib/post-filter-context";

export default function HomePage() {
    return (
        <div className="mx-auto w-full max-w-6xl p-5 md:px-9 md:py-8">
            <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-[1fr_1.2fr]">
                <section>
                    <PostForm />
                </section>

                <PostFilterProvider>
                    <section>
                        <PostFilters />
                        <PostList />
                    </section>
                </PostFilterProvider>
            </div>
        </div>
    );
}
