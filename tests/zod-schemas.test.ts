import { describe, expect, it } from "vitest";
import { createPostSchema } from "@/lib/zod-schemas";

describe("createPostSchema", () => {
	it("valid payload passes", () => {
		const result = createPostSchema.safeParse({
			title: "Valid title",
			content: "This is valid content with more than twenty chars.",
			author: "John",
			tags: ["redux", "next"],
		});
		expect(result.success).toBe(true);
	});

	it("invalid payload fails", () => {
		const result = createPostSchema.safeParse({
			title: "No",
			content: "short",
			author: "A",
			tags: [],
		});
		expect(result.success).toBe(false);
	});
});