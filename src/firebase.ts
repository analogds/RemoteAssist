import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFunctions } from 'firebase/functions'

// The LMS's Firebase web app (threadx-demo). /assist is served from the same origin as the LMS,
// so the LMS sign-in session is already here.
const app = initializeApp({
  apiKey: 'AIzaSyD2VrlJ5-WJ9WGzZOtH2Atrtr9u4iFtDHk',
  appId: '1:401208123214:web:dd305e3690cc3efb04881f',
  messagingSenderId: '401208123214',
  projectId: 'threadx-demo',
  authDomain: 'threadx-demo.firebaseapp.com',
  storageBucket: 'threadx-demo.firebasestorage.app',
})

export const auth = getAuth(app)
// us-east1: where remoteAssistToken (functions/index.js) and the other ThreadX functions live.
export const functions = getFunctions(app, 'us-east1')
