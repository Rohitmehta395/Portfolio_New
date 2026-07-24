import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import connectDB from '@/lib/db/connect';
import User from '@/models/User.model';
import env from '@/config/env';

/**
 * NextAuth (Auth.js v5) Configuration.
 * Sourced exclusively via env.auth (from config/env.ts).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.auth.secret,
  providers: [
    Google({
      clientId: env.auth.googleClientId,
      clientSecret: env.auth.googleClientSecret,
    }),
    GitHub({
      clientId: env.auth.githubClientId,
      clientSecret: env.auth.githubClientSecret,
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    /**
     * CALLBACK-LEVEL ALLOW-LIST ENFORCEMENT:
     * Evaluates the authenticated account's email against env.auth.adminEmail.
     * If the email does NOT match, sign-in is rejected directly (returns false).
     * No session is ever created or stored for non-admin accounts.
     */
    async signIn({ user, account }) {
      if (!user?.email) {
        return false;
      }

      const adminEmail = env.auth.adminEmail.trim().toLowerCase();
      const userEmail = user.email.trim().toLowerCase();

      if (userEmail !== adminEmail) {
        console.warn(
          `[Auth.js Security Warning] Non-admin sign-in attempt rejected for: "${user.email}". Allowed admin: "${adminEmail}"`
        );
        return false;
      }

      // Upsert authorized Admin User document in MongoDB Atlas
      try {
        await connectDB();
        const providerName = (account?.provider === 'github' ? 'github' : 'google') as
          | 'google'
          | 'github';

        await User.findOneAndUpdate(
          { email: userEmail },
          {
            name: user.name || 'Admin User',
            email: userEmail,
            image: user.image || undefined,
            role: 'admin',
            provider: providerName,
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error('[Auth.js] Failed to sync admin User document to database:', err);
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = 'admin';
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role || 'admin';
      }
      return session;
    },
  },
});
