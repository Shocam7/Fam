import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "@/lib/supabase"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
      },
      async authorize(credentials) {
        if (!credentials?.username) return null

        // Check if user exists in Supabase
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', `${credentials.username}@example.com`)
          .single()

        if (existingUser) {
           return {
             id: existingUser.id,
             name: existingUser.name,
             email: existingUser.email,
             image: existingUser.image
           }
        }

        // Create user if not exists (Mock behavior for dev)
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({
            name: credentials.username,
            email: `${credentials.username}@example.com`,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.username}`
          })
          .select()
          .single()

        if (error) {
            console.error("Error creating user:", error)
            return null
        }

        return {
             id: newUser.id,
             name: newUser.name,
             email: newUser.email,
             image: newUser.image
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    }
  }
}

export const handler = NextAuth(authOptions)
