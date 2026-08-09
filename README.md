# 🍃 MongoDB Mastery

**An interactive, dashboard-style learning platform for mastering MongoDB — from your first document to production-ready databases.**

MongoDB Mastery turns a full MongoDB syllabus into a browsable, hands-on web app: a searchable sidebar of 140+ topics, a live query playground, visual explainers for arrays/aggregation/indexes, 300+ practice questions, and a 100-question interview bank — all wrapped in a dark, developer-tool-inspired UI.

> 🌱 Beginner → 💻 CRUD Developer → 🧠 Intermediate → ⚡ Advanced → 🏗️ Backend Engineer → 🚀 MongoDB Expert

**🔗 Live demo:** [mongodb-navigator.vercel.app](https://mongodb-navigator.vercel.app/)

---

## ✨ Features

**Navigation & UX**
- Sticky top navbar with global search (`Ctrl/Cmd + K`) across topics, operators, and questions
- Collapsible sidebar organized into 20+ curriculum sections (Getting Started → Interview Prep)
- Dark/light theme toggle, persisted across sessions
- Fully responsive: sidebar collapses to a slide-out drawer on mobile

**Learning tools**
- **Query Playground** — write and run simulated MongoDB queries (`find`, projection, sort, skip, limit, comparison/logical operators) against an in-memory dataset of 20+ student documents
- **Aggregation Pipeline Visualizer** — step through `$match → $group → $sort` and see how documents transform at each stage
- **Index Visualizer** — side-by-side animation of a collection scan vs. an index scan
- **Shell vs. Compass tabs** — every relevant query is shown both as a `mongosh` command and as the equivalent Compass Filter/Project/Sort fields, with common placement mistakes called out explicitly
- **Schema Design comparisons** — embedding vs. referencing, with guidance on when to use each
- **`$elemMatch` deep dive** — visual walkthrough of matching within a single array element vs. across separate conditions

**Practice & retention**
- 300+ practice questions across 5 difficulty tiers (query writing, output prediction, debugging, aggregation, Compass)
- 100-question interview bank (Beginner → Expert) in accordion format, with starred high-priority questions
- Progress tracking, bookmarking, and per-topic personal notes — all persisted in `localStorage`
- Searchable cheat sheet of operators and syntax
- 30-day study plan and an interactive roadmap with clickable milestones

**Reference sections**
- PyMongo (Python driver) examples
- Node.js: native driver vs. Mongoose, with a feature comparison table
- Mongoose schemas, models, validation, middleware, population, and virtuals
- A capstone project: a full **Student Management System** data model with realistic queries

---

## 🛠️ Tech Stack

This project was generated and is maintained via [Lovable](https://lovable.dev).

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

*(If you're working from the original vanilla HTML/CSS/JS build of this project — `index.html`, `style.css`, `script.js` with no framework dependencies — see [`docs/legacy-vanilla-build.md`](./docs/legacy-vanilla-build.md) or open the corresponding branch.)*

---

## 🚀 Getting Started

**Prerequisites:** Node.js and npm ([install via nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

```sh
# 1. Clone the repository
git clone <this-repository-url>
cd <repository-name>

# 2. Install dependencies
npm i

# 3. Start the dev server (auto-reloading, instant preview)
npm run dev
```

The app will be available locally at the URL printed in your terminal (typically `http://localhost:5173`).

---

## 📁 Project Structure

```
├── src/                  # Application source
│   ├── components/       # UI components (sidebar, navbar, cards, playground, quiz, etc.)
│   ├── data/              # Curriculum content, question banks, sample dataset
│   ├── pages/             # Topic pages / routed views
│   └── styles/            # Theming and global styles
├── public/                # Static assets
├── index.html
└── README.md
```

*(Adjust to match your actual folder layout if it differs.)*

---

## 📚 Curriculum Overview

| Stage | Covers |
|---|---|
| **Getting Started** | Introduction, architecture, installation, tools |
| **Database Basics** | Databases, collections, documents, BSON, ObjectId, data types |
| **CRUD** | `insertOne`/`insertMany`, `find`, `update*`, `delete*` |
| **Query Operators** | Comparison, logical, element, evaluation, array operators |
| **Arrays & Embedded Docs** | Dot notation, arrays of objects, `$elemMatch` |
| **Projection & Query Utilities** | Field inclusion/exclusion, `sort`, `limit`, `skip`, `distinct` |
| **Update Operators** | `$set`, `$inc`, `$push`, `$pull`, array modifiers |
| **Indexes** | Single/compound/multikey/unique/text/TTL indexes, `explain()` |
| **Aggregation** | Full pipeline stage reference with visual walkthroughs |
| **Schema Design** | Embedding vs. referencing, normalization |
| **Validation & Security** | `$jsonSchema`, authentication, authorization, RBAC |
| **Transactions** | ACID, sessions |
| **Drivers & ODMs** | PyMongo, MongoDB Node driver, Mongoose |
| **Optimization** | Query/index optimization, pagination |
| **Capstone** | Student Management System project |
| **Practice & Interview** | 300+ practice questions, 100 interview questions |

---

## 🌐 Deployment

Open this project in [Lovable](https://lovable.dev/projects/9ade71e1-23cd-408c-b299-74a867fdedb3) and use **Share → Publish**. To connect a custom domain, go to **Project → Settings → Domains → Connect Domain** ([guide](https://docs.lovable.dev/features/custom-domain#custom-domain)).

## ✏️ Editing this project

- **In Lovable** — [open the editor](https://lovable.dev/projects/9ade71e1-23cd-408c-b299-74a867fdedb3) and start prompting; changes are committed straight to this repo.
- **In your own IDE** — clone locally, edit, and push; changes sync back to Lovable automatically.
- **Directly on GitHub** — edit a file in the repo UI and commit.
- **GitHub Codespaces** — launch a Codespace from the repo's **Code → Codespaces** tab for a full cloud dev environment.

---

## 🤝 Contributing

Contributions are welcome — new practice questions, additional operator explainers, or curriculum corrections are all useful. Please open an issue or PR describing the change.

## 📄 License

Add your preferred license here (e.g., MIT).

---

*Built for B.Tech CSE students learning MongoDB from the ground up.*
