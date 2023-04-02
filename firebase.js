// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase-admin/app');
const {
	getFirestore,
	Timestamp,
	FieldValue,
} = require('firebase-admin/firestore');

/* 
	*** Your web app's Firebase configuration ***
 	When you create a project in the Firebase console on the website, a configuration object is created. ---> passed to the app variable defined below.

 	- Firebase object is perfectly safe to include on the client side. It's how the firebase library knows how to communicate with your firebase project.
 	- If worried about security, use security roles and App Check --> https://firebase.google.com/docs/projects/api-keys#api-keys-for-firebase-are-different 
 */
const firebaseConfig = {
	apiKey: 'AIzaSyBPUW8uRGUPl142AoWRp9UdZzxC3TZW77A',
	authDomain: 'seismicsafe-b9fb3.firebaseapp.com',
	projectId: 'seismicsafe-b9fb3',
	storageBucket: 'seismicsafe-b9fb3.appspot.com',
	messagingSenderId: '624186050384',
	appId: '1:624186050384:web:859e2a120a80f0c0610e55',
	measurementId: 'G-LB78HBM6ST',
};

// Initialize Firebase. This function creates a Firebase app that stores your Firebasee configuration for your project.
// This function creates a Firebase App instance --> this instance is how the Firebase SDK knows how to connect to your specific Firebase backend
const app = initializeApp(firebaseConfig);

//Initialize Cloud Firestore and get a reference to the service
const db = getFirestore();

// test collection (seen on Firebase web)
const User = db.collection('Users').doc('user');

module.exports = { User };
