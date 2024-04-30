/// <reference types="astro/client" />

type D1Namespace = import("@cloudflare/workers-types/experimental").D1Database;
type ENV = {
    SERVER_URL: string;
    D1: D1Namespace;
    DEV: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;
    GOOGLE_VERIFIER: string;
};

type Runtime = import("@astrojs/cloudflare").AdvancedRuntime<ENV>;

declare namespace App {
    interface Locals extends Runtime {
        session: import("lucia").Session | null;
        user: import("lucia").User | null;
    }
}
