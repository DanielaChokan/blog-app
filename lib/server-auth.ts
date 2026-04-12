import { NextRequest } from "next/server";
import admin from "firebase-admin";

export async function requireUser(req: NextRequest) {
	const authHeader = req.headers.get("authorization") ?? "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

	if (!token) {
		throw new Error("UNAUTHORIZED");
	}

	try {
		const decoded = await admin.auth().verifyIdToken(token);
		return decoded;
	} catch {
		throw new Error("UNAUTHORIZED");
	}
}