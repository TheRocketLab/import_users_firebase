# Bulk import users to Firebase

This repo assumes that your passwords are encryped using `BCRYPT`. If you are using a different encryption please refer to the firebase docs https://firebase.google.com/docs/auth/admin/import-users

## Steps to run

1. Run `npm i` in terminal
2. Export your user data to `user.json` making sure the object looks like the existing i.e. [{id: '', email: '', pwd: ''}]
3. Copy the `.env.sample` file to `.env` and fill in using your Firebase credentials
4. Check the `importUsers.js` which contains an example for importing a single user
5. Run `node importUsers.js` to run to test
6. Utilise the `mapUsers` function once you can confirm the import works correctly