import type { D1Database as CFD1Database } from "@cloudflare/workers-types/latest";

declare global {
  type D1Database = CFD1Database;

  interface Fetcher {
    fetch(request: Request): Promise<Response>;
  }

  interface ExecutionContext {
    waitUntil(promise: Promise<unknown>): void;
    passThroughOnException(): void;
  }

  interface Env {
    ASSETS: Fetcher;
    DB: D1Database;
    RESEND_API_KEY?: string;
    SPEAKING_FROM_EMAIL?: string;
    SPEAKING_TO_EMAIL?: string;
    IMAGES: {
      input(stream: ReadableStream): {
        transform(options: Record<string, unknown>): {
          output(options: {
            format: string;
            quality: number;
          }): Promise<{ response(): Response }>;
        };
      };
    };
  }
}

export {};
