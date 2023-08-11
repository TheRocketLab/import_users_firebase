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

// Read user data from JSON file
const userData = fs.readFileSync('users.json', 'utf-8');
const users = JSON.parse(userData);

// Generate an object with the correct format for importing into Firebase 
const mapUsers = users.map((user) => {
  return {
    uid: user.id,
    email: user.email,
    passwordHash: Buffer.from(user.pwd),
  };
});

firebaseAdmin.auth().importUsers(
  // Use the below to test importing a single user
  // Once you can confirm that works, then you can use the mapUsers array
  [
    {
      uid: '48',
      email: 'blashddssddsfsdsdgsdgddddsddblah@blah.com',
      passwordHash: Buffer.from("$2y$08$alTap0IsDWpRLUIUA2Sgdure8DL9nvejVf7CpU5.nQIlcdhAOB8n6")
    }
  ],
  // mapUsers,
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
