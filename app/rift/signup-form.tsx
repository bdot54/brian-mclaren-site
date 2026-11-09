"use client";

import { useEffect, useState, type FormEvent } from "react";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
const UTM_STORAGE_KEY = "rift-utm";

export type Defaults = { source: string; medium: string; campaign?: string; content?: string };

export function readAttribution(defaults?: Defaults) {
  const stored: Record<string, string> = {};
  try {
    const saved = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (saved) Object.assign(stored, JSON.parse(saved));
  } catch {
    // Storage unavailable; fall back to the URL alone.
  }
  const params = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) stored[key] = value;
  }
  if (!stored.utm_source && defaults) {
    stored.utm_source = defaults.source;
    stored.utm_medium = defaults.medium;
    stored.utm_campaign = defaults.campaign ?? "great-rift";
    if (defaults.content) stored.utm_content = defaults.content;
  }
  return {
    utmSource: stored.utm_source ?? "",
    utmMedium: stored.utm_medium ?? "",
    utmCampaign: stored.utm_campaign ?? "",
    utmContent: stored.utm_content ?? "",
  };
}

export function RiftSignupForm({ defaults }: { defaults?: Defaults } = {}) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get("utm_source")) return;
    const found: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) found[key] = value;
    }
    try {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
    } catch {
      // Storage unavailable; the URL is still read at submit time.
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("Sending…");
    const data = new FormData(form);

    try {
      const response = await fetch("/api/rift-signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(data),
          ...readAttribution(defaults),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Please try again.");
      form.reset();
      setStatus(
        "Check your inbox — your first four chapters are on the way.",
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please try again.");
    }
  }

  return (
    <form className="newsletter-wrap" onSubmit={submit}>
      <div className="newsletter-form">
        <label className="form-field" htmlFor="rift-name">
          <span className="form-field-label">First name</span>
          <input id="rift-name" name="firstName" required />
        </label>
        <label className="form-field" htmlFor="rift-last-name">
          <span className="form-field-label">Last name</span>
          <input id="rift-last-name" name="lastName" required />
        </label>
        <label className="form-field" htmlFor="rift-email">
          <span className="form-field-label">Email address</span>
          <input id="rift-email" name="email" type="email" required />
          <span className="form-field-note">
            By submitting your email, you consent to join the free EDGEWISE
            newsletter.
          </span>
        </label>
        <div className="newsletter-submit">
          <span className="form-field-label" aria-hidden="true">
            Send
          </span>
          <button className="button button-primary" type="submit">
            Send me the chapters
          </button>
          <p className="newsletter-note">
            Unsubscribe anytime. We do not sell your information.
          </p>
        </div>
      </div>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="rift-website">Website</label>
        <input
          id="rift-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input name="consent" type="hidden" value="yes" />
      {status && (
        <p className="form-status" role="status">
          {status}
        </p>
      )}
    </form>
  );
}
