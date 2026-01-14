// Type definitions cho Cloudflare Workers environment
// Bindings: D1 database, KV namespace

export interface Env {
    // Cloudflare D1 Database
    DB: D1Database;

    // KV Namespace cho rate limiting AI
    AI_RATE_LIMIT: KVNamespace;

    // Environment variables
    ENVIRONMENT: string;
    OPENROUTER_API_KEY?: string;
}

// User type cho auth context
export interface AuthUser {
    id: string;
    username: string;
    displayName: string | null;
    role: 'student' | 'admin';
}

// Hono context variables - cho c.set/c.get
export interface Variables {
    user: AuthUser | null;
}

// Extended context với user info
export interface AuthContext {
    user: AuthUser | null;
}

