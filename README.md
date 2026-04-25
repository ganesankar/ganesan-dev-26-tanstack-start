# Ganesan.dev TanStack Start Migration 🚀  

This repository represents the next-generation migration of the Ganesan.dev personal portfolio and CMS application. It was fully refactored from Next.js/Tailwind CSS into a bleeding-edge Single Page Application leveraging the **TanStack Start** framework.

## 🌟 Core Technology Stack

*   **Framework:** [TanStack Start](https://tanstack.com/start) (Full-stack React)
*   **Routing:** [TanStack Router](https://tanstack.com/router) (Type-safe file-based routing)
*   **State & Fetching:** [TanStack Query](https://tanstack.com/query) v5 (Suspense-driven data fetching)
*   **Data Grid:** [TanStack Table](https://tanstack.com/table) v8 (Headless UI for Admin tables)
*   **UI Components:** [MUI (Material UI)](https://mui.com/) heavily customized utilizing `sx` paradigms specifically engineered to visually mirror the density and sleekness of Tailwind CSS and Shadcn UI.
*   **Backend & Auth:** Firebase (Firestore, Auth, Storage) natively integrated.
*   **Rich Text:** `@uiw/react-md-editor` with live Markdown parsing.

## 🏗️ Architecture Overview

The app is deeply divided using TanStack Router's layout capabilities into two entirely independent application layers:

### 1. `_public` (The Frontend)
Serves as the high-performance UI visible to all end-users. 
*   **Routes:** `/`, `/blog`, `/portfolio`, `/resume`, `/contact`
*   **Key Behavior:** Utilizes fluid viewport constraints natively matching `1536px` (`maxWidth="2xl"`) max-width wrappers. Content is aggressively cached and dynamically hydrated leveraging Suspense loaders.

### 2. `admin` (The CMS Backend)
A protected UI allowing authenticated manipulation of the Firestore database.
*   **Routes:** `/admin`, `/admin/posts`, `/admin/portfolio`, `/admin/resume`, etc.
*   **Key Behavior:** Features native Firebase Auth gateway closures. The `DataTable.tsx` module has been heavily weaponized to support stateful **Bulk Actions**, **Column Visibility Toggling**, and interactive Row Selection.

## 🛠️ Key Migration Highlights (Next.js -> TanStack)

- **Routing Model Transformation:** Route paths were transitioned from Next `app/` conventions (`page.tsx`, `layout.tsx`) over to TanStack file-based specs (`$slug.tsx`, `__root.tsx`). Loaders are declared directly in route configs utilizing Query Client injection.
- **Tailwind -> MUI Extraction:** The entire aesthetic layer was meticulously reconstructed. Standard MUI elements were fundamentally squashed (e.g. `size="small"`, tight custom flex gaps, compact paddings) to enforce a dark-mode optimal, Shadcn-like visual profile. 
- **Centralized Data Queries:** Fetch logic has been strictly isolated in the `/queries` folder, providing tightly bound reusable options configurations for caching policies.

## 🚀 Getting Started

### Prerequisites
*   Node.js (`>=18.x`)
*   A Firebase project configuration payload.

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the environment configuration. Provide your `VITE_FIREBASE_*` keys representing your backend connection within a local `.env` block.
4. Fire up the development server:
   ```bash
   npm run dev
   ```

## 🗄️ Database Provisioning & Security Rules

Because this project relies natively on Firebase Firestore for purely client-side queried data, **tables (Collections) do not need to be manually created**. Writing a single document to logic arrays automatically spawns the underlying collection. Wait for your first CMS save to initialize them.

However, you **must set up Firestore Security Rules**. By default, all traffic will be rejected.  
Go to **Firebase Console -> Firestore Database -> Rules**, and paste the following baseline config:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 1. Establish an admin guard checking for custom auth claims
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }

    // 2. Publicly read published entities, admins manage all
    match /posts/{postId} { allow read: if resource.data.published == true; allow write: if isAdmin(); }
    match /pages/{pageId} { allow read: if resource.data.published == true; allow write: if isAdmin(); }
    match /portfolio/{itemId} { allow read: if resource.data.published == true; allow write: if isAdmin(); }
    match /resume/{itemId} { allow read: if resource.data.published == true; allow write: if isAdmin(); }
    
    // 3. Taxonomies (tags/categories) are fully public read
    match /categories/{categoryId} { allow read: if true; allow write: if isAdmin(); }
    match /tags/{tagId} { allow read: if true; allow write: if isAdmin(); }

    // 4. Client Contact Form logic (Users write, Admins read)
    match /messages/{messageId} {
      allow create: if request.resource.data.keys().hasAll(['name', 'email', 'message', 'read', 'created_at'])
                    && request.resource.data.read == false;
      allow read, update, delete: if isAdmin();
    }
  }
}
```
*(Make sure you have created your first auth user and explicitly stamped them with an `admin : true` custom claim to unlock backend functions!)*

---

## 🚀 Deployment Strategy (Firebase Hosting)

Deployment pipelines target **Firebase Hosting**. Because TanStack Start handles bleeding-edge Single Page behavior, you must explicitly tell Firebase to trap router paths rather than throwing 404s for URLs like `/admin/posts`.

### 1. Configure the Framework
Make sure your native `firebase.json` specifies the React Application builder correctly mapping to Vite's `dist` output:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 2. Build the Bundles
Compile your `.tsx` environment and bundle all Vite assets for production:
```bash
npm run build
```

### 3. Deploy
Ensure your Firebase CLI is authenticated via `firebase login` and targeting your specific project ID (`firebase use <project-id>`). To ship the `dist` folder:
```bash
firebase deploy --only hosting
```
