import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect();

      // Verify if the user exists in the database
      const existingUser = await User.findOne({ userId: profile.id });
      console.log('Existing User:', existingUser);

      if (existingUser && existingUser.role === 'admin') {
        return true;
      } else {
        return false;
      }
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.userId = token.userId;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userId = user.userId;
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
