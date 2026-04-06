export type Post = {
	id: string;
	title: string;
	content: string;
	author: string;
	tags: string[];
	createdAt: string;
	updatedAt: string;
};

export type Comment = {
	id: string;
	postId: string;
	author: string;
	text: string;
	createdAt: string;
};

export type PostWithComments = Post & { comments?: Comment[] };

//Dto - Data Transfer Object
export type CreatePostDto = {
	title: string;
	content: string;
	author: string;
	tags: string[];
};

export type UpdatePostDto = Partial<CreatePostDto>;

export type CreateCommentDto = {
	author: string;
	text: string;
};