/*
 * Firebase project for the menu (Authentication + Firestore).
 * These values are public by design: Firebase web config is meant to sit in
 * page code. Access is controlled by Firestore security rules (firestore.rules)
 * and by who has an account in Firebase Authentication.
 * Setting window.FIREBASE_CONFIG = null switches Firebase off: guests then see the copy in menu-data.js
 * and the admin page cannot save.
 */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBMjY4tfuhTr4aPdVIU9SU9gfuV4gIF3Jo",
  authDomain: "gautam-hotel-admin.firebaseapp.com",
  projectId: "gautam-hotel-admin",
  storageBucket: "gautam-hotel-admin.firebasestorage.app",
  messagingSenderId: "112914079786",
  appId: "1:112914079786:web:f789b94c111dad66362353"
};
