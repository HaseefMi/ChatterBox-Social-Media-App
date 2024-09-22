import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDWahEdiIE56XT_bIqyiVaUoLr8sN8ZBfI",
  authDomain: "chatterbox-af796.firebaseapp.com",
  projectId: "chatterbox-af796",
  storageBucket: "chatterbox-af796.appspot.com",
  messagingSenderId: "1091522277016",
  appId: "1:1091522277016:web:db2b4f1699bbfedcb16aed"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app)


export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
  if (!userAuth) return;
  const userDocRef = doc(db, 'Users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);
  
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName, email, createdAt, ...additionalInformation
      })
    }
    catch (error) {
      console.log('Error Creating the User', error.message);
    }
  }

  return userDocRef;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
  }
)

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
