import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/use-auth-user", () => ({
	useAuthUser: () => ({
		user: { uid: "test-user", email: "test@example.com" },
		loading: false,
	}),
}));

vi.mock("@/lib/firebase-client", () => ({
	clientAuth: {
		currentUser: null,
	},
}));

import PostForm from "@/components/PostForm";

describe("PostForm", () => {
	it("shows validation message for empty form", async () => {
		const user = userEvent.setup();

		render(
			<PostForm />
		);

		await user.click(screen.getByRole("button", { name: /create/i }));
		expect(await screen.findByText(/title/i)).toBeInTheDocument();
	});
});