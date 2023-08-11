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

// Reference to the "users" collection
const usersCollection = firebaseAdmin.firestore().collection('users');

// Function to delete all items from a collection
async function deleteAllItems(collectionRef) {
  try {
    const querySnapshot = await collectionRef.get();

    const batch = firebaseAdmin.firestore().batch();
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('All items deleted successfully.');
  } catch (error) {
    console.error('Error deleting items:', error);
  }
}

// Call the function to delete all items from the "users" collection
deleteAllItems(usersCollection);

