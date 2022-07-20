import React, { useState, useEffect } from "react";
import "./Settings.css";
import { db } from "../../firebase-config";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
    onSnapshot,
    query,
    setDoc,
    where,
    orderBy,
    // serverTimestamp
} from "firebase/firestore";

export const Settings = () => {
    const userEmail = sessionStorage.getItem("email");
    const userUid = sessionStorage.getItem("uid");
    const userFirstName = sessionStorage.getItem("firstName");
    const userLastName = sessionStorage.getItem("lastName");
    const userDOB = sessionStorage.getItem("DOB");
    const userMobile = sessionStorage.getItem("mobile");
    const [userData, setUserData] = useState(null);
    const userRef = collection(db, "users");

    useEffect(() => {
        const getUserData = async () => {
            const data = await getDocs(userRef);
            const currentUserData = [];
            const usersData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            //only grabs the user who is logged in data
            for (let i = 0; i < usersData.length; i++) {
                if (usersData[i].uid === userUid) {
                    currentUserData.push(usersData[i]);
                }
            }
            setUserData(currentUserData);

            //NOTE: this is not working because it trys to render before userData is defined
        };

        getUserData();
    }, []);

    //  console.log(userData[0].lastName)
    console.log(userData);
    
    return (
        <div>
            <h1>Settings</h1>
            <h3>Account Information</h3>
            <p>Update your account information</p>
            <h4>Personal Information</h4>
            <label>First Name</label>
            <input placeholder={userData}></input>
            <label>Last Name</label>
            <input placeholder="lastName user data here"></input>
            <h1></h1>
        </div>
    );
};
