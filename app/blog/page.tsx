import type { Metadata } from "next";

import { BlogList } from "./blog-list";

export const metadata: Metadata = {
  title: "Notes from the Journey",
  description:
    "Brian D. McLaren’s blog: new posts and notes from the journey, newest first.",
};

export default function BlogPage() {
  return <BlogList />;
}
