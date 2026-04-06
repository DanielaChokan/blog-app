import admin from "firebase-admin";

function getPrivateKey() {
	const key = process.env.FIREBASE_PRIVATE_KEY;
	if (!key) {
		throw new Error("Missing FIREBASE_PRIVATE_KEY");
	}
	return key.replace(/\\n/g, "\n");
}

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: getPrivateKey(),
		}),
	});
}

export const db = admin.firestore();

export const postsCollection = db.collection("posts");
export const commentsCollection = db.collection("comments");