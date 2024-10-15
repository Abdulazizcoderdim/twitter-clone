import User from '@/database/user.model';
import { AuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { connectToDatabase } from './mongoose';

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectToDatabase();

      const isExistingUser = await User.findOne({
        email: session.user?.email,
      });

      if (!isExistingUser) {
        const newUser = await User.create({
          email: session.user?.email,
          name: session.user?.name,
          profileImage: session.user?.image,
        });

        
      }

      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' },
  jwt: { secret: process.env.NEXTAUTH_JWT_SECRET },
  secret: process.env.NEXTAUTH_SECRET,
};
