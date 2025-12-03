import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";


// ✅ Extend both JWT and Session types
declare module "next-auth" {
  interface User {
    accessToken?: string;
    username?: string;
    isSuperAdmin?: boolean;
    id: string;
  }

  interface Session {
    user: {
      username: string;
      isSuperAdmin?: boolean;
      id: string;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    username?: string;
    isSuperAdmin?: boolean;
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any) {
        console.log("🔵 [AUTH] Starting authorization");

        try {
          const res = await fetch("http://127.0.0.1:3001/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }), // ✅ Only send username and password, not all credentials
          });

          const data = await res.json();
          console.log("🔵 [AUTH] Response:", { status: res.status, data });

          if (!res.ok || !data.token) {
            throw new Error(data?.message || "Invalid credentials");
          }

          console.log("✅ [AUTH] Login successful");

          // ✅ IMPORTANT: Return object must have 'id' property
          const user = {
            id: data.id,
            accessToken: data.token,
            isSuperAdmin: data.isSuperAdmin,
            username: data.username,
          };

          console.log("✅ [AUTH] Returning user:", user);
          return user;
        } catch (error) {
          console.error("🔴 [AUTH] Error:", error);
          throw error instanceof Error
            ? error
            : new Error("Authentication failed");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 hours
  },

  debug: true,

  callbacks: {
    async jwt({ token, user, trigger }) {
      console.log("========== JWT CALLBACK START ==========");
      console.log("🔵 [JWT] Trigger:", trigger);
      console.log("🔵 [JWT] User received:", user);
      console.log("🔵 [JWT] Current token:", token);

      if (user) {
        console.log("✅ [JWT] User exists, updating token2");
        token.accessToken = user.accessToken;
        token.username = user.username;
        token.isSuperAdmin = user.isSuperAdmin;
        token.id = user.id;
        console.log("✅ [JWT] Updated token:", token);
      }

      console.log("========== JWT CALLBACK END ==========");
      console.log('tokennn: ', token)
      return token;
    },

    async session({ session, token }) {
      console.log("========== SESSION CALLBACK START ==========");
      console.log("🔵 [SESSION] Token:", token);
      console.log("🔵 [SESSION] Current session:", session);

      if (token) {
        session.user = {
          id: token.id as string,
          username: token.username as string,
          isSuperAdmin: token.isSuperAdmin as boolean,
        };
        session.accessToken = token.accessToken as string;
        console.log("✅ [SESSION] Updated session:", session);
      }

      console.log("========== SESSION CALLBACK END ==========");
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
