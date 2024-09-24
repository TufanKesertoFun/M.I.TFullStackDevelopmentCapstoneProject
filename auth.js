// auth.js

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

// Function to fetch the user from the database based on email
async function getUser(email) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0]; // Return the first user found
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate credentials using zod
        const parsedCredentials = z
          .object({ 
            email: z.string().email(), 
            password: z.string().min(6) 
          })
          .safeParse(credentials);

        // If the credentials are valid
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email); // Get user from the database

          // If user is not found, return null
          if (!user) {
            return null;
          }

          // Compare the hashed password with the provided one
          const passwordsMatch = await bcrypt.compare(password, user.password);

          // If the password matches, return the user, else return null
          if (passwordsMatch) {
            return user;
          }
        }

        // Invalid credentials
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
