import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import './Login.css'
import { useLocation, useHistory } from "react-router-dom";

//  otp
import firebaseAuthenntication from "../../Firebase/firebase.init";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";



firebaseAuthenntication();

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);

    const { user, signInUsingGoogle, getPhoneNumberFromUserInput } = useAuth();

    const location = useLocation();
    // console.log(user);
    console.log(location.state?.from);
    const redirect_url = location.state?.from || '/';
    const history = useHistory();
    // if (user.email) {
    //     history.push(redirect_url);
    // }

    const handleGoogleSignIn = () => {
        signInUsingGoogle()
            .then(result => {
                console.log('Google sing in success');
                history.push(redirect_url);
            })
            .catch(error => {
                console.log(error.message);
            })

    }

    // otp 

    const [otp, setOtp] = useState('');
    const [number, setNumber] = useState('');
    const auth = getAuth();
    const setUpRecapcha = () => {
        console.log('Set up reaccha')
        window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                onSignInSubmit();
            }
        }, auth);
    }
    
    const catchPhoneNumber = (e) => {
        setNumber(e.target.value);
    }

    const onSignInSubmit = () => {
        const phoneNumber = "+91" + number;
        console.log(phoneNumber);
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

    const catchOtp = (e) => {
        setOtp(e.target.value);
    }
    const verificationOtp = () => {
        const code = otp;
        console.log('otp-', code);
        window.confirmationResult.confirm(code).then((result) => {
            // User signed in successfully.
            const user = result.user;
            console.log(user);
            // ...
        }).catch((error) => {
            // User couldn't sign in (bad verification code?)
            // ...
            console.log('cathc error--', error.message);
        });
    }

    return (
        <div className="login">
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                {/* register your input into the hook by invoking the "register" function */}
                <input type="email" defaultValue="" {...register("example")} placeholder="Email" />

                {/* include validation with required or other standard HTML validation rules */}

                {/* errors will return when field validation fails  */}
                {errors.exampleRequired && <span className="error">This field is required</span>}

                <input type="submit" value="Login" />

            </form>
            {/* <h5>----------------OR------------------</h5> */}

            <input onBlur={catchPhoneNumber} type="number" placeholder="Number" />
            <button onClick={onSignInSubmit}>Submit</button>
            <div id="sign-in-button"></div>

            <h3>OTP</h3>
            <input onBlur={catchOtp} type="text" name="otp" id="" placeholder="Enter OTP" />
            <button onClick={verificationOtp}>Otp Submit</button>

            <div>------------------------</div>
            <Button onClick={handleGoogleSignIn} variant="contained">Googel Sign In</Button>

        </div>
    );
};

export default Login;