import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MongoDB Mastery — Interactive MongoDB Learning Platform" },
      {
        name: "description",
        content:
          "Learn MongoDB end to end: CRUD, operators, aggregation, indexes, schema design, Mongoose, PyMongo, a query playground and 300 practice questions.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "MongoDB Mastery — Interactive MongoDB Learning Platform",
      },
      {
        property: "og:description",
        content:
          "Interactive MongoDB course: playground, visualizers, cheat sheet, roadmap and 300 practice questions.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ href: "/mongodb-mastery/index.html" });
  },
  component: () => null,
});

