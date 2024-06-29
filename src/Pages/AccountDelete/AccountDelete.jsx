import styles from './AccountDelete.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const AccountDelete = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [name, setName] = useState("");
    const deleteAccount = () => {
        fetch("https://api.salondekho.in/api/auth/deleteOwner", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
            })
        }).then((res) => {
            return res.json();
        }).then((data) => {
            if(data.success){
                alert("Account Deleted Successfully");
                navigate("/");
            }else{
                toast.error(data.message);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return ( 
        <div className={styles.main}>
            <div>
                <h1>Salon Dekho</h1>
                <label>
                    Phone Number
                    <input type="text" placeholder="Enter your phone number" onChange={(event)=>{
                        setPhoneNumber(event.target.value);
                    }} />
                </label>
                <label>
                    Name
                    <input type="text" placeholder="Enter your name" onChange={(event)=>{
                        setName(event.target.value);
                    }} />
                </label>
                <button onClick={deleteAccount}>Delete Account</button>
            </div>
        </div>
     );
}
 
export default AccountDelete;