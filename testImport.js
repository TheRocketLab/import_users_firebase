require('dotenv').config()
const fs = require('fs')
const firebaseAdmin = require('firebase-admin')

const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY
// Initialize Firebase
if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// Collection name you are going to import into
const FIREBASE_COLLECTION = 'users'

// Read user data from JSON file
const userData = fs.readFileSync('users.json', 'utf-8');
const users = JSON.parse(userData);


const firestore = firebaseAdmin.firestore()

// uid must match the id passed in doc() below
firestore.collection(FIREBASE_COLLECTION).doc('4816521231231').set({
  displayName: 'Joe Bloggs',
  email: 'joe.bloggs@gmail.com',
}).then(() => {
  console.log('Document successfully written!');
}).catch((error) => {
  console.error('Error writing document: ', error);
});

firebaseAdmin.auth().importUsers(
  // Use the below to test importing a single user
  // Once you can confirm that works, then you can use the bulkImportUsers.js script
  [
    {
      uid: '4816521231231',
      email: 'joe.bloggs@gmail.com',
      passwordHash: Buffer.from("$2a$12$ptzSDrLIW.A/2BNS9TKC6urWY7sOpdv2Bm3rcpWGpBgmi3UuiK9ri"),
    }
  ],
  {
    hash: {
      algorithm: 'BCRYPT'
    }
  }
)
.then((userRecord) => {
  console.log('Successfully imported ', userRecord.successCount, ' users with ', userRecord.failureCount, ' failures');
  console.log('Firebase errors: ', userRecord.errors);
})
.catch((error) => {
  console.error('Error importing user:', error);
});
