// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Add config from firebase.
const firebaseConfig = {
	apiKey: 'AIzaSyC7h00ztN3AKGS79h7vHFECuPKCTiKianw',
	authDomain: 'folio-8b029.firebaseapp.com',
	projectId: 'folio-8b029',
	storageBucket: 'folio-8b029.appspot.com',
	messagingSenderId: '724755977367',
	appId: '1:724755977367:web:fb7a98653fc82a388b85d2',
	measurementId: 'G-519JV5VKEV'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// export const submitFeedback = (component: string, message: string) => {
// 	const feedback = collection(db, 'feedback');
// };
