import type { Metadata } from "next";
import { BlogAdmin } from "./blog-admin";

export const metadata: Metadata = {
  title: "Blog admin",
  robots: { index: false, follow: false },
};

export default function BlogAdminPage() {
  return <BlogAdmin />;
}
