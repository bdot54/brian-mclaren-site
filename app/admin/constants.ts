// Not a secret — exists only so a username field appears on the login form,
// which is what gets browsers/password managers to offer saving the login.
// Shared between server routes (app/admin/auth.ts) and the client login
// form (app/admin/blog/blog-admin.tsx), so it stays in its own file with no
// server-only imports.
export const ADMIN_USERNAME = "brianmclaren";
