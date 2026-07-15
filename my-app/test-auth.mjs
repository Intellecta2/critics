import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAcDbncFNicF_QnxyPTHt_sXnsxqJD5thE',
  authDomain: 'critics-da3a0.firebaseapp.com',
  projectId: 'critics-da3a0',
  storageBucket: 'critics-da3a0.firebasestorage.app',
  messagingSenderId: '1002249190267',
  appId: '1:1002249190267:web:75e2c3a14953e2587b1bde',
  measurementId: 'G-SJ9G2XCQT9'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

signInWithEmailAndPassword(auth, 'test@test.com', 'password')
  .then(() => console.log('Success'))
  .catch(err => console.error('Sign In Error:', err.code, err.message));

createUserWithEmailAndPassword(auth, 'test2@test.com', 'password')
  .then(() => console.log('Success signup'))
  .catch(err => console.error('Sign Up Error:', err.code, err.message));
