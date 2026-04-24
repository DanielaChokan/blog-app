import { notFound } from "next/navigation";
import PostDetail from "@/components/PostDetail";
import { getPostWithCommentsServer } from "@/lib/services/posts.server";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const post = await getPostWithCommentsServer(id);

	if (!post) notFound();

	return (
		<div className="mx-auto w-full max-w-4xl px-5 py-5 md:px-9 md:py-8">
			<PostDetail id={id} initialData={post} />
		</div>
	);
}

