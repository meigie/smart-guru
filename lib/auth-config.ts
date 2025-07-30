import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "./users";

const MOCK_ADMIN = {
  id: "cmdbgcjto0000oftbzg7xvh7c",
  email: "admin@example.com",
  name: "Tan Ah Kaw",
  password: "$2a$10$0feBGfTlnxWSsBkr3ec4suTKfmWdS70Q.G/y5xykFg66MH76280J6",
  role: "ADMIN",
  department: "AAD",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_USER = {
  id: "abcbgcjto0000oftbzg7xvh7c",
  email: "user@example.com",
  name: "Xiao Mei Mei",
  password: "$2a$10$0feBGfTlnxWSsBkr3ec4suTKfmWdS70Q.G/y5xykFg66MH76280J6",
  role: "USER",
  department: "HIS",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_USERS = [MOCK_ADMIN, MOCK_USER];

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development-only",
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Auth attempt for:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        // simulator db
        // const user = await prisma.user.findUnique({
        //   where: { email: credentials.email },
        // });
        const user = MOCK_USERS.find(
          (user) => user.email === credentials.email
        );

        if (!user) {
          console.log("User not found:", credentials.email);
          return null;
        }

        console.log("User found, checking password...");
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          console.log("Invalid password for user:", credentials.email);
          return null;
        }

        console.log("Authentication successful for:", credentials.email);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department as User["department"],
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
