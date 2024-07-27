import styles from "./LoginPopup.module.css";
import { atom, useAtom } from "jotai";
import { useState } from "react"; // Import useState

const loginState = atom(1);
const PhoneNumber = atom("");

const LoginPopup = ({ click }) => {
  const [login, setLogin] = useAtom(loginState);

  return (
    <div className={styles.loginPopup}>
      <button className={styles.closeButton} onClick={click}>
        X
      </button>
      {login === 1 ? <SendOtp /> : login === 2 ? <VerifyOtp /> : <Details />}
    </div>
  );
};

const SendOtp = () => {
  const [login, setLogin] = useAtom(loginState);
  const [phoneNumber, setPhoneNumber] = useAtom(PhoneNumber);

  const sendOTP = () => {
    setLogin(2);
  };

  return (
    <div>
      <div>
        <h2>Enter your mobile number</h2>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Mobile Number"
        />
        <button onClick={sendOTP}>Send OTP</button>
      </div>
    </div>
  );
};

const VerifyOtp = () => {
  const [login, setLogin] = useAtom(loginState);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [phoneNumber, setPhoneNumber] = useAtom(PhoneNumber);

  const verifyOTP = () => {
    setLogin(3);
  };

  return (
    <div>
      <div>
        <h2>Enter OTP</h2>
        <input
          type="text"
          value={enteredOTP}
          onChange={(e) => setEnteredOTP(e.target.value)}
          placeholder="OTP"
        />
        <button onClick={verifyOTP}>Verify</button>
      </div>
    </div>
  );
};

const Details = () => {
  const [login, setLogin] = useAtom(loginState);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submitDetails = () => {
    // Handle the submission logic here
    alert("Details submitted successfully");
  };

  return (
    <div>
      <div>
        <h2>Enter your details</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button onClick={submitDetails}>Submit</button>
      </div>
    </div>
  );
};

export default LoginPopup;
