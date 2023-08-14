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

// Generate an object with the correct format for importing into Firebase 
const mapUsers = users.map((user) => {
  return {
    uid: user.id,
    email: user.email,
    passwordHash: Buffer.from(user.pwd),
  };
});

const firestore = firebaseAdmin.firestore()

users.map((user) => {
  firestore.collection(FIREBASE_COLLECTION).doc(user.id).set({
    displayName: user.firstname + ' ' + user.lastname,
    email: user.email,
    hasLifetimeAccess: false,
    stripeCustomerId: user.stripe_customer_id,
    stripeSubscriptionId: user.stripe_subscription_id,
    stripePriceId: 'price_XXXXXXXXXXXXXXXXXXXXXXX',
    stripeSubscriptionStatus: 'active',
  }).then(() => {
    console.log('Document successfully written!');
  }).catch((error) => {
    console.error('Error writing document: ', error);
  });
});

firebaseAdmin.auth().importUsers(
  mapUsers,
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
