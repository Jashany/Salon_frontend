import React from 'react';
import styles from './Login.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhone] = useState('');
    const handlesubmit = () => {
        fetch('http://localhost:5000/api/user/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                navigate('/verify-otp').props({ phoneNumber })
            })

    }
    return ( 
        <div className={styles.main}>
            <div>

                <h1>Log-in/Sign-up</h1>
                <label>
                    Enter Phone Number
                    <input type="number" placeholder='6280036528'
                    value={phoneNumber}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength='10'
                     />
                </label>
                <button onClick={handlesubmit}>Get OTP</button>
            </div>
        </div>
     );
}
 
export default Login;