import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import PostForm from "@/components/PostForm";
import { createAppStore } from "@/store";

describe("PostForm", () => {
	it("shows validation message for empty form", async () => {
		const user = userEvent.setup();
		const store = createAppStore();

		render(
			<Provider store={store}>
				<PostForm />
			</Provider>
		);

		await user.click(screen.getByRole("button", { name: /create/i }));
		expect(await screen.findByText(/title/i)).toBeInTheDocument();
	});
});