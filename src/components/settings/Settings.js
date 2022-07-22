import React, { useState, useEffect, Component } from "react";
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
    const [userData, setUserData] = useState([]);
    const userRef = collection(db, "users");

    useEffect(() => {
        const getUserData = async () => {
            const data = await getDocs(userRef);

            const usersData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            const currentUserData = [];
            for (let i = 0; i < usersData.length; i++) {
                if (usersData[i].uid === userUid) {
                    currentUserData.push(usersData[i]);
                }
            }
            setUserData(currentUserData);
        };
        getUserData();
    }, []);

    const userAccount = userData.map((data) => (
        <div>
            <div className="header">
                <h1>Settings</h1>
                <h4>
                    {data.firstName} {data.lastName}
                </h4>
            </div>
            <div className="account-info">
                <h3>Account Information</h3>
                <p>Update your account information</p>
            </div>
            <div className="personal-info-editBtn-row">
                <h4>Personal Information</h4>
                <button>Edit</button>
            </div>
            <div className="names-row">
                <div className="first-name">
                    <label type="text">First Name</label>
                    <input placeholder={data.firstName}></input>
                </div>
                <div className="last-name">
                    <label type="text">Last Name</label>
                    <input placeholder={data.lastName}></input>
                </div>
            </div>
            <div className="DOB-mobile-row">
                <div className="DOB">
                    <label>Date of Birth</label>
                    <input type="date" placeholder={data.DOB}></input>
                </div>
                <div className="mobile">
                    <label>Mobile</label>
                    <input type="number" placeholder={data.mobile}></input>
                </div>
            </div>
            <div className="email-row">
                <label>
                    Email
                    <span className="instructions">
                        (Must be a valid e-mail address)
                    </span>
                </label>
                <input type="email" placeholder={data.email}></input>
            </div>
        </div>
    ));
    return <div className="settings--container">{userAccount}</div>;
};
