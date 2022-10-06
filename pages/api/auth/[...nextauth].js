import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  /*   database: process.env.MONGODB_URI,
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        return profile;
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
  }, */
});
