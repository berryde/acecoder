// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Add config from firebase.
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
	authDomain: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) + '.firebaseapp.com',
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
	storageBucket: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) + '.appspot.com',
	messagingSenderId: '724755977367',
	appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
	measurementId: 'G-519JV5VKEV'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// export const submitFeedback = (component: string, message: string) => {
// 	const feedback = collection(db, 'feedback');
// };
