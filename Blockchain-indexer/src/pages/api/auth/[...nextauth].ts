import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { verifyPassword, verifyMfaToken } from '@/lib/auth';
import { generateVerificationToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'user',
          verified: true, // Google accounts are already verified
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        mfaCode: { label: 'MFA Code', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !(await verifyPassword(credentials.password, user.password))) {
          throw new Error('Invalid email or password');
        }

        if (!user.verified) {
          throw new Error('Please verify your email before logging in');
        }

        // Check MFA if enabled
        if (user.mfaEnabled) {
          if (!credentials.mfaCode) {
            throw new Error('MFA_REQUIRED');
          }

          const isValidMfa = user.mfaMethod === 'totp' 
            ? verifyMfaToken(user.mfaSecret!, credentials.mfaCode)
            : credentials.mfaCode === user.mfaSecret; // Email-based OTP stored temporarily in mfaSecret
          
          if (!isValidMfa) {
            throw new Error('Invalid MFA code');
          }
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name || user.email.split('@')[0],
          role: user.role,
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // When a user signs in with OAuth, set their role
      if (user && account && account.provider === 'google') {
        token.id = user.id;
        token.role = user.role;
      }
      
      // For credentials login, this remains the same
      if (user && !account) {
        token.id = user.id;
        token.role = user.role;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);