import { betterAuth } from 'better-auth'
import {drizzleAdapter} from 'better-auth/adapters/drizzle'
import { db } from './db';
import * as schema from './db/schema'
import {organization} from 'better-auth/plugins'

export const auth = betterAuth({
   appName: 'NextJs Blog',
   secret: process.env.BETTER_AUTH_SECRET || 'BETTER_AUTH_SECRET',
   baseURL: process.env.BETTER_AUTH_URL,
   database: drizzleAdapter(db,{
     provider: "pg",
     schema: {
       ...schema,
       user: schema.users,
       session: schema.sessions,
       account: schema.accounts,
       organization: schema.organizations,
       member: schema.members,
       invitation: schema.invitations,
     },
   }),
   emailAndPassword: {
      enabled: true,
		requireEmailVerification: false,
		minPasswordLength: 6,
		maxPasswordLength: 128,
		autoSignIn: false,
   },
   session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
			enabled: true, // Enable caching session in cookie (default: `false`)	
			maxAge: 300 // 5 minutes
		},
      disableSessionRefresh: true, // Disable session refresh so that the session is not updated regardless of the `updateAge` option. (default: `false`)
   },
   advanced: {
      useSecureCookies: process.env.NODE_ENV === 'production',
      defaultCookieAttributes: {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		},
   },
   plugins: [
      organization(),
   ],
});