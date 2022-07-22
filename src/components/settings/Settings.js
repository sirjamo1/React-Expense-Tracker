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
    const userUid = sessionStorage.getItem("uid");
    const [userData, setUserData] = useState([]);
    const userRef = collection(db, "users");
    const [userFirstName, setUserFirstName] = useState()
    const [userLastName, setUserLastName] = useState();
    const [userDOB, setUserDOB] = useState();
    const [userMobile, setUserMobile] = useState();
    const [userEmail, setUserEmail] = useState();
console.log(userFirstName)

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
            setUserFirstName(currentUserData[0].firstName)
            setUserLastName(currentUserData[0].lastName);
            setUserDOB(currentUserData[0].DOB);
            setUserMobile(currentUserData[0].mobile);
            setUserEmail(currentUserData[0].email);
        };
        getUserData();
    }, []);
    console.log(userData[0].id)
        const handleEditUser = async () => {
            const updateCurrent = doc(db, "users", userData[0].id);
            await updateDoc(updateCurrent, {
                firstName: userFirstName,
                lastName: userLastName,
                DOB: userDOB,
                mobile: userMobile,
                email: userEmail,
            });
        };

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
                <button onClick={handleEditUser}>Edit</button>
            </div>
            <div className="names-row">
                <div className="first-name">
                    <label type="text">First Name</label>
                    <input
                        onChange={(event) => {
                            setUserFirstName(event.target.value);
                        }}
                        placeholder={data.firstName}
                    ></input>
                </div>
                <div className="last-name">
                    <label type="text">Last Name</label>
                    <input
                        onChange={(event) => {
                            setUserLastName(event.target.value);
                        }}
                        placeholder={data.lastName}
                    ></input>
                </div>
            </div>
            <div className="DOB-mobile-row">
                <div className="DOB">
                    <label>Date of Birth</label>
                    <input
                        onChange={(event) => {
                            setUserDOB(event.target.value);
                        }}
                        type="date"
                    ></input>
                </div>
                <div className="mobile">
                    <label>Mobile</label>
                    <input
                        onChange={(event) => {
                            setUserMobile(event.target.value);
                        }}
                        
                        placeholder={data.mobile}
                    ></input>
                </div>
            </div>
            <div className="email-row">
                <label>
                    Email
                    <span className="instructions">
                        (Must be a valid e-mail address)
                    </span>
                </label>
                <input
                    onChange={(event) => {
                        setUserEmail(event.target.value);
                    }}
                    type="email"
                    placeholder={data.email}
                ></input>
            </div>
        </div>
    ));
    return <div className="settings--container">{userAccount}</div>;
};
