"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { insertLink } from "./insert-link";
import { ADMIN_USERNAME } from "../constants";

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
};

const EMPTY_FORM = { title: "", slug: "", excerpt: "", body: "" };

export function BlogAdmin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [username, setUsername] = useState(ADMIN_USERNAME);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [lastSavedSlug, setLastSavedSlug] = useState<string | null>(null);
  const [currentPublished, setCurrentPublished] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const linkRange = useRef({ start: 0, end: 0 });
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkAddress, setLinkAddress] = useState("");
  const [linkError, setLinkError] = useState("");

  const openLinkPanel = () => {
    const textarea = bodyRef.current;
    const start = textarea?.selectionStart ?? form.body.length;
    const end = textarea?.selectionEnd ?? start;
    linkRange.current = { start, end };
    setLinkText(form.body.slice(start, end));
    setLinkAddress("");
    setLinkError("");
    setLinkOpen(true);
  };

  const applyLink = () => {
    const { start, end } = linkRange.current;
    const result = insertLink(form.body, start, end, linkText, linkAddress);
    if (!result.ok) {
      setLinkError(result.error);
      return;
    }
    setForm({ ...form, body: result.body });
    setLinkOpen(false);
    requestAnimationFrame(() => {
      const textarea = bodyRef.current;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(result.cursor, result.cursor);
      }
    });
  };

  const loadPosts = () => {
    fetch("/api/admin/blog-posts").then((response) => {
      if (response.status === 401) {
        setAuthed(false);
        return;
      }
      setAuthed(true);
      response.json().then((data) => setPosts(data.posts ?? []));
    });
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setLoginError(data.error ?? "Incorrect username or password.");
      return;
    }
    setPassword("");
    loadPosts();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setPosts([]);
  };

  const startNewPost = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setCurrentPublished(false);
    setFormError("");
    setNotice("");
    setLastSavedSlug(null);
  };

  const startEditingPost = (post: Post) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
    });
    setCurrentPublished(post.published);
    setFormError("");
    setNotice("");
    setLastSavedSlug(null);
  };

  const savePost = async (action: "preview" | "draft" | "publish") => {
    setFormError("");
    setSaving(true);
    // Open the tab synchronously, before the await below, or browsers'
    // popup blockers will swallow it — then point it at the real URL
    // once the save finishes.
    const previewWindow = action === "preview" ? window.open("", "_blank") : null;
    try {
      const published = action === "draft" ? false : action === "publish" ? true : currentPublished;
      const url = editingId ? `/api/admin/blog-posts/${editingId}` : "/api/admin/blog-posts";
      const method = editingId ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, published }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFormError(data.error ?? "Something went wrong saving the post.");
        previewWindow?.close();
        return;
      }

      if (action === "preview") {
        setEditingId(data.post.id);
        setForm({
          title: data.post.title,
          slug: data.post.slug,
          excerpt: data.post.excerpt,
          body: data.post.body,
        });
        setCurrentPublished(data.post.published);
        setNotice("Saved. Preview opened in a new tab.");
        setLastSavedSlug(null);
        if (previewWindow) {
          previewWindow.location.href = `/archive/${data.post.slug}`;
        } else {
          window.open(`/archive/${data.post.slug}`, "_blank", "noreferrer");
        }
        loadPosts();
        return;
      }

      setNotice(action === "publish" ? "Post published." : "Draft saved.");
      setLastSavedSlug(data.post?.slug ?? null);
      setEditingId(null);
      setForm(EMPTY_FORM);
      setCurrentPublished(false);
      loadPosts();
    } finally {
      setSaving(false);
    }
  };

  const submitPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const action = (submitter?.dataset.action as "preview" | "draft" | "publish" | undefined) ?? "draft";
    savePost(action);
  };

  const uploadImage = async (file: File) => {
    setFormError("");
    setUploadingImage(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/blog-images", { method: "POST", body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFormError(data.error ?? "Something went wrong uploading the image.");
        return;
      }

      const markdown = `![](${data.url})`;
      const textarea = bodyRef.current;
      if (textarea) {
        const start = textarea.selectionStart ?? textarea.value.length;
        const end = textarea.selectionEnd ?? textarea.value.length;
        const before = form.body.slice(0, start);
        const after = form.body.slice(end);
        const needsLeadingBreak = before && !before.endsWith("\n\n") ? "\n\n" : "";
        const needsTrailingBreak = after && !after.startsWith("\n\n") ? "\n\n" : "";
        const inserted = `${needsLeadingBreak}${markdown}${needsTrailingBreak}`;
        setForm({ ...form, body: before + inserted + after });
      } else {
        setForm({ ...form, body: form.body ? `${form.body}\n\n${markdown}` : markdown });
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const confirmDeletePost = async (post: Post) => {
    await fetch(`/api/admin/blog-posts/${post.id}`, { method: "DELETE" });
    setDeletingId(null);
    if (editingId === post.id) startNewPost();
    loadPosts();
  };

  if (authed === null) {
    return <main style={styles.page}>Loading…</main>;
  }

  if (!authed) {
    return (
      <main style={styles.page}>
        <h1 style={styles.heading}>Blog admin</h1>
        <form onSubmit={submitLogin} style={styles.loginForm}>
          <label htmlFor="admin-username" style={styles.label}>
            Username
          </label>
          <input
            id="admin-username"
            name="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            style={styles.input}
            autoComplete="username"
            autoFocus
          />
          <label htmlFor="admin-password" style={styles.label}>
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={styles.input}
            autoComplete="current-password"
          />
          <button type="submit" style={styles.primaryButton}>
            Log in
          </button>
          {loginError ? <p style={styles.error}>{loginError}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.headerRow}>
        <h1 style={styles.heading}>Blog admin</h1>
        <button type="button" onClick={logout} style={styles.secondaryButton}>
          Log out
        </button>
      </div>

      <section style={styles.formSection}>
        <h2 style={styles.subheading}>{editingId ? "Edit post" : "New post"}</h2>
        <form onSubmit={submitPost} style={styles.form}>
          <label style={styles.label}>
            Title
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            URL slug (leave blank to generate from the title)
            <input
              type="text"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
              style={styles.input}
              placeholder="auto-generated from title"
            />
          </label>
          <label style={styles.label}>
            Short excerpt (shows in the archive list)
            <input
              type="text"
              value={form.excerpt}
              onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Post body — plain text. Leave a blank line between paragraphs.
            Use **bold** for bold. To add a link, select the words you want
            to link, then click &ldquo;Add a link&rdquo; below the box.
            <textarea
              ref={bodyRef}
              value={form.body}
              onChange={(event) => setForm({ ...form, body: event.target.value })}
              style={styles.textarea}
              rows={16}
              required
            />
          </label>
          <div style={styles.uploadRow}>
            <button type="button" style={styles.uploadLabel} onClick={openLinkPanel}>
              Add a link
            </button>
            <span style={styles.uploadHint}>
              Select the words first, then click. A web address pasted on its own
              also becomes a link.
            </span>
          </div>
          {linkOpen ? (
            <div style={styles.linkPanel} role="group" aria-label="Add a link">
              <label style={styles.label}>
                Words that should be the link
                <input
                  type="text"
                  value={linkText}
                  onChange={(event) => setLinkText(event.target.value)}
                  style={styles.input}
                  placeholder="For example: Southern Lights 2027"
                />
              </label>
              <label style={styles.label}>
                Web address
                <input
                  type="text"
                  value={linkAddress}
                  onChange={(event) => setLinkAddress(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      applyLink();
                    }
                  }}
                  style={styles.input}
                  placeholder="Paste it here, like https://southernlightsconference.com"
                  autoFocus
                />
              </label>
              {linkError ? <p style={styles.error}>{linkError}</p> : null}
              <div style={styles.formActions}>
                <button type="button" style={styles.primaryButton} onClick={applyLink}>
                  Add link
                </button>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => setLinkOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
          <div style={styles.uploadRow}>
            <label style={styles.uploadLabel}>
              {uploadingImage ? "Uploading…" : "Add a photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) uploadImage(file);
                  event.target.value = "";
                }}
                disabled={uploadingImage}
                style={styles.fileInput}
              />
            </label>
            <span style={styles.uploadHint}>
              JPEG, PNG, GIF, or WebP, up to 8MB. Drops the image link into the body
              above wherever your cursor is.
            </span>
          </div>
          {editingId ? (
            <p style={styles.statusLine}>
              Currently: <strong>{currentPublished ? "Published" : "Draft"}</strong>
            </p>
          ) : null}

          {formError ? <p style={styles.error}>{formError}</p> : null}
          {notice ? (
            <p style={styles.notice}>
              {notice}{" "}
              {lastSavedSlug ? (
                <a
                  href={`/archive/${lastSavedSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.previewLink}
                >
                  Preview it →
                </a>
              ) : null}
            </p>
          ) : null}

          <div style={styles.formActions}>
            <button
              type="submit"
              data-action="preview"
              style={styles.secondaryButton}
              disabled={saving}
            >
              {saving ? "Saving…" : "Preview"}
            </button>
            <button
              type="submit"
              data-action="draft"
              style={styles.secondaryButton}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save as Draft"}
            </button>
            <button
              type="submit"
              data-action="publish"
              style={styles.primaryButton}
              disabled={saving}
            >
              {saving ? "Saving…" : "Publish"}
            </button>
            {editingId ? (
              <button type="button" onClick={startNewPost} style={styles.secondaryButton}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section>
        <h2 style={styles.subheading}>All posts</h2>
        {posts.length === 0 ? <p>No posts yet.</p> : null}
        <ul style={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} style={styles.postRow}>
              <div>
                <strong>{post.title}</strong>
                {!post.published ? <span style={styles.draftTag}>Draft</span> : null}
                <div style={styles.postMeta}>
                  /archive/{post.slug} ·{" "}
                  {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                  }).format(new Date(post.publishedAt))}
                </div>
              </div>
              <div style={styles.postActions}>
                {deletingId === post.id ? (
                  <>
                    <span style={styles.confirmText}>Delete this post?</span>
                    <button
                      type="button"
                      onClick={() => confirmDeletePost(post)}
                      style={styles.dangerButton}
                    >
                      Yes, delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(null)}
                      style={styles.secondaryButton}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href={`/archive/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.secondaryButton}
                    >
                      Preview
                    </a>
                    <button type="button" onClick={() => startEditingPost(post)} style={styles.secondaryButton}>
                      Edit
                    </button>
                    <button type="button" onClick={() => setDeletingId(post.id)} style={styles.dangerButton}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "48px 24px 96px",
    fontFamily: "Helvetica Neue, Arial, sans-serif",
    color: "#1c1c1c",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  heading: { fontSize: 28, margin: 0 },
  subheading: { fontSize: 20, marginBottom: 12 },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxWidth: 320,
  },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  formSection: {
    marginBottom: 48,
    paddingBottom: 32,
    borderBottom: "1px solid #ddd",
  },
  label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 14 },
  statusLine: { fontSize: 14, color: "#444" },
  input: {
    font: "inherit",
    padding: "8px 10px",
    border: "1px solid #bbb",
    borderRadius: 4,
  },
  textarea: {
    font: "inherit",
    padding: "8px 10px",
    border: "1px solid #bbb",
    borderRadius: 4,
    resize: "vertical",
  },
  uploadRow: { display: "flex", alignItems: "center", gap: 12, marginTop: -4 },
  uploadLabel: {
    font: "inherit",
    fontSize: 14,
    padding: "8px 14px",
    background: "#fff",
    color: "#1c1c1c",
    border: "1px solid #bbb",
    borderRadius: 4,
    cursor: "pointer",
  },
  fileInput: { display: "none" },
  uploadHint: { fontSize: 12, color: "#666" },
  linkPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 16,
    border: "1px solid #bbb",
    borderRadius: 4,
    background: "#fafafa",
  },
  formActions: { display: "flex", gap: 12 },
  primaryButton: {
    font: "inherit",
    padding: "10px 18px",
    background: "#1c1c1c",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  secondaryButton: {
    font: "inherit",
    padding: "10px 18px",
    background: "#fff",
    color: "#1c1c1c",
    border: "1px solid #bbb",
    borderRadius: 4,
    cursor: "pointer",
  },
  dangerButton: {
    font: "inherit",
    padding: "10px 18px",
    background: "#fff",
    color: "#b3261e",
    border: "1px solid #b3261e",
    borderRadius: 4,
    cursor: "pointer",
  },
  error: { color: "#b3261e", fontSize: 14 },
  notice: { color: "#1a7f37", fontSize: 14 },
  previewLink: { color: "#1a7f37", fontWeight: 600 },
  postList: { listStyle: "none", padding: 0, margin: 0 },
  postRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },
  postMeta: { fontSize: 13, color: "#666", marginTop: 4 },
  postActions: { display: "flex", gap: 8, flexShrink: 0, alignItems: "center" },
  confirmText: { fontSize: 13, color: "#b3261e" },
  draftTag: {
    marginLeft: 8,
    fontSize: 11,
    textTransform: "uppercase",
    color: "#946200",
    background: "#fff3cd",
    padding: "2px 6px",
    borderRadius: 3,
  },
};
