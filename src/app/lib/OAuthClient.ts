import { OAuth2Client } from 'google-auth-library'

if (!process.env.GOOGLE_REDIRECT_URI) {
    throw new Error('GOOGLE_REDIRECT_URI is not defined in the environment variables.');
}

console.log('GOOGLE_REDIRECT_URI: ', process.env.GOOGLE_REDIRECT_URI)

const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI
})

export default client