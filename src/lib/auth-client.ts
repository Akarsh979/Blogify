import { createAuthClient } from 'better-auth/react'
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
   baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000', // // The base URL of your auth server
   plugins: [ 
        organizationClient() 
    ] 
})

export const {signUp,signIn,signOut,useSession,organization} = authClient;