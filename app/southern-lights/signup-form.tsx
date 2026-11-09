"use client";

import { useEffect, useState, type FormEvent } from "react";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
const UTM_STORAGE_KEY = "sl-utm";

function readAttribution() {
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
  return {
    utmSource: stored.utm_source ?? "",
    utmMedium: stored.utm_medium ?? "",
    utmCampaign: stored.utm_campaign ?? "",
    utmContent: stored.utm_content ?? "",
  };
}

export function SouthernLightsSignupForm() {
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
      const response = await fetch("/api/southern-lights-signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(data),
          ...readAttribution(),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Please try again.");
      form.reset();
      setStatus(
        "Check your inbox. Your Southern Lights discount code is on the way.",
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please try again.");
    }
  }

  return (
    <form className="newsletter-wrap" onSubmit={submit}>
      <div className="newsletter-form">
        <label className="form-field" htmlFor="sl-name">
          <span className="form-field-label">First name</span>
          <input id="sl-name" name="firstName" required />
        </label>
        <label className="form-field" htmlFor="sl-last-name">
          <span className="form-field-label">Last name</span>
          <input id="sl-last-name" name="lastName" required />
        </label>
        <label className="form-field" htmlFor="sl-email">
          <span className="form-field-label">Email address</span>
          <input id="sl-email" name="email" type="email" required />
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
            Send me the code
          </button>
          <p className="newsletter-note">
            Unsubscribe anytime. We do not sell your information.
          </p>
        </div>
      </div>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="sl-website">Website</label>
        <input
          id="sl-website"
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
