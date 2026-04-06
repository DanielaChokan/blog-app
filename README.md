# Blog App

## 1. Project Description

Blog Appis a single-page blog application where you can:

- view a list of posts;
- create new posts with field validation;
- open a detailed post page;
- edit and delete posts;
- add comments;
- filter posts by title or author.

## 2. Technology Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Redux Toolkit + React Redux
- Firebase Firestore (via firebase-admin on the server)
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
- API Routes: server-side route handlers in app/api/posts/** for CRUD operations on posts and comments.
- Redux: client-side state management in store/ (slices + thunks + provider).
- Firestore: data storage via firebase-admin in lib/firebase-admin.ts.
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
- form validation for creating a post with empty fields.

## 6. GitHub Repository

https://github.com/DanielaChokan/blog-app.git

