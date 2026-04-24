# Blog App

## 1. Project Description

Blog App is a single-page blog application where you can:

- view a list of posts;
- create new posts with field validation;
- open a detailed post page;
- edit and delete posts;
- add comments;
- filter posts by title or author.
- sign in with Firebase Authentication (email/password);
- perform protected post updates/deletes only as a post owner.

Additional behavior implemented in API:

- optimistic concurrency control for post update/delete via expectedVersion;
- conflict handling (409) when post version is stale;
- automatic comment cleanup when deleting a post.

## 2. Technology Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- SWR (data fetching and cache)
- React Hook Form + @hookform/resolvers
- Firebase Firestore (via firebase-admin on the server)
- Firebase Authentication (client + server token verification)
- Zod (data validation)
- Vitest + Testing Library (testing)
- CSS Modules (styling)

## 3. Getting Started

1. Install dependencies:

```bash
npm i
```

2. Create a .env.local file in the project root:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_FIREBASE_API_KEY=your-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-web-app-id
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## 4. Architecture

- App Router: pages and routes located in the app/ folder.
- API Routes: server-side route handlers in app/api/posts/** for CRUD operations on posts and comments, with ownership and version checks.
- SWR: client-side data fetching with stale-while-revalidate, deduplication, and optimistic updates.
- Firestore: data storage via firebase-admin in lib/firebase-admin.ts.
- Auth:
	- client auth state and token usage in lib/use-auth-user.ts and components/AuthPanel.tsx;
	- server token verification in lib/server-auth.ts (Bearer token).
- Zod: shared client- and server-side validation using schemas in lib/zod-schemas.ts.

## 5. Tests and Coverage

- Run tests:

```bash
npm test
```

- Watch mode:

```bash
npm run test:watch
```

- Coverage:

```bash
npx vitest run --coverage
```

Current tests cover:

- basic validation of the post Zod schema;
- form validation for creating a post with empty fields;
- SWR hook behavior for posts (optimistic create, rollback on delete error, revalidation after 409 conflict);
- API security checks for protected PATCH/DELETE operations;
- API optimistic concurrency conflict handling (409);
- utility behavior for batched comment deletion.

## 6. GitHub + Vercel

[Source Code](https://github.com/DanielaChokan/blog-app.git)

[Live Demo](https://blog-app-six-gold.vercel.app/)
