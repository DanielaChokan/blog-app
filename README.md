# Blog App

## 1. Project Description

Blog App is a Next.js blog application built with App Router.

Features:

- view a list of posts;
- create new posts with form validation;
- open a dedicated post details page;
- edit and delete posts;
- add comments to posts;
- filter posts by title or author;
- sign in with Firebase Authentication (email/password);
- perform protected post updates and deletes only as a post owner.

Additional API behavior:

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
- Zod (validation)
- Tailwind CSS v4 (styling)
- Vitest + Testing Library (testing)

## 3. Getting Started

1. Install dependencies:

```bash
npm install
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

4. Open:

```text
http://localhost:3000
```

## 4. Architecture

- App Router pages and route handlers are located in the app/ directory.
- API routes in app/api/posts/** implement CRUD for posts and comments with ownership and version checks.
- SWR handles client-side fetching with stale-while-revalidate and optimistic updates.
- Firestore access is implemented via firebase-admin in lib/firebase-admin.ts.
- Authentication:
  - client auth state and token handling are in lib/use-auth-user.ts and components/AuthPanel.tsx;
  - server token verification is in lib/server-auth.ts (Bearer token).
- Shared validation schemas are defined in lib/zod-schemas.ts.

## 5. Tests and Coverage

Run tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage:

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
