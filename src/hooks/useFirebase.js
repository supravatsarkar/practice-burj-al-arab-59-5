import firebaseAuthenntication from "../Firebase/firebase.init"
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useEffect, useState } from "react";


firebaseAuthenntication();


const useFirebase = () => {
    const [user, setUser] = useState({});
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

    const setUpRecapcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                onSignInSubmit();
            }
        }, auth);
    }

    const onSignInSubmit = () => {
        const phoneNumber = '+919851650495';
        const appVerifier = window.recaptchaVerifier;
        setUpRecapcha();
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                console.log(phoneNumber);
                window.confirmationResult = confirmationResult;
                // ...
            }).catch((error) => {
                // Error; SMS not sent
                // ...
                console.log('inside signinPhone', error.message);
            });
    }


    const signInUsingGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    }

    const logOut = () => {
        signOut(auth)
            .then(() => {

            })
            .catch(error => {
                console.log('Logout error--', error.message);
            })
    }

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user);
            } else {
                // logout
                setUser({});
            }
        })
    }, [])


    return {
        user,
        signInUsingGoogle,
        logOut,
        setUpRecapcha,
        onSignInSubmit
    }
}

export default useFirebase;