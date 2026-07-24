/**
 * Environment Variable Accessor & Validator
 *
 * Provides typed, central access to environment variables documented in `.env.example`.
 * Variables are grouped by feature domain. Core variables required for standard app operation
 * (e.g. DATABASE_URL) are validated when accessed, while feature-specific variables
 * (Authentication, GitHub GraphQL API, Cloudinary) are validated lazily upon feature invocation
 * to avoid blocking earlier development phases before those credentials are configured.
 */

function getEnvVar(key: string, required: boolean = false, fallback: string = ''): string {
  const value = process.env[key] || fallback;
  if (required && !value) {
    throw new Error(
      `[Env Error] Missing required environment variable: "${key}". ` +
      `Please check your .env file or environment configuration and set "${key}".`
    );
  }
  return value;
}

export const env = {
  /**
   * Database configuration (Required for DB connectivity - Phase 2+)
   */
  get databaseUrl(): string {
    return getEnvVar('DATABASE_URL', true);
  },

  /**
   * Site canonical URL (Defaults to localhost in local development)
   */
  get siteUrl(): string {
    return getEnvVar('NEXT_PUBLIC_SITE_URL', false, 'http://localhost:3000');
  },

  /**
   * Authentication configuration (Required in Phase 16: Auth setup)
   * Evaluated lazily when admin authentication routes are accessed.
   */
  get auth() {
    return {
      secret: getEnvVar('AUTH_SECRET', true),
      googleClientId: getEnvVar('GOOGLE_CLIENT_ID', true),
      googleClientSecret: getEnvVar('GOOGLE_CLIENT_SECRET', true),
      githubClientId: getEnvVar('GITHUB_CLIENT_ID', true),
      githubClientSecret: getEnvVar('GITHUB_CLIENT_SECRET', true),
      adminEmail: getEnvVar('ADMIN_EMAIL', true),
    };
  },

  /**
   * GitHub Activity graph configuration (Required in Phase 7: GitHub Activity)
   * Evaluated lazily when fetching contribution data from GitHub GraphQL API.
   */
  get github() {
    return {
      token: getEnvVar('GITHUB_TOKEN', true),
      username: getEnvVar('GITHUB_USERNAME', true),
    };
  },

  /**
   * Cloudinary storage configuration (Required in Phase 18: Project/Blog CMS Uploads)
   * Evaluated lazily when media upload actions are performed.
   */
  get cloudinary() {
    return {
      cloudName: getEnvVar('CLOUDINARY_CLOUD_NAME', true),
      apiKey: getEnvVar('CLOUDINARY_API_KEY', true),
      apiSecret: getEnvVar('CLOUDINARY_API_SECRET', true),
    };
  },
};

export default env;
