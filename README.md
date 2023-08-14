# Bulk Import or Delete Users to Firebase

This repo assumes that your passwords are encryped using `BCRYPT`. If you are using a different encryption please refer to the firebase docs https://firebase.google.com/docs/auth/admin/import-users

## Project Setup
1. Run `npm i` in terminal
2. Copy the `.env.sample` file to `.env` and fill in using your Firebase credentials

## Run a Test
1. Run `testImport.js` 
2. Check the Auth and Firestore sections in Firebase to see if the sample data from the users.json has been correctly uploaded

## Run the Bulk Import
1. Export your user data to `user.json` making sure the object looks like the existing i.e. [{id: '', email: '', pwd: ''}]
2. Run `node bulkImportUsers.js` to run the import

## Run the Bulk Delete
1. Run `node bulkDeleteItems.js` to run the delete script