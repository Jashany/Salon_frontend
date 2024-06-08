import React, { useEffect } from 'react';
import { json } from 'react-router-dom';

const OTP = () => {

    useEffect(() => {
        window.otpless = (otplessUser) => {
            console.log(json.stringify(otplessUser));
        };

        const script = document.createElement('script');
        script.src = "https://otpless.com/v2/auth.js";
        script.async = true;
        script.id = "otpless-sdk";
        script.setAttribute('data-appid', 'GUV51XISATNSJJGV13Q4');
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (
        <div id="otpless-login-page"></div>
    );
}

export default OTP;