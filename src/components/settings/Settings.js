import React, { useState, useEffect, Component } from "react";
import "./Settings.css";
import Popup from "reactjs-popup";
import {
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";

import { useAuth } from "../../Auth";

export const Settings = () => {
    const { user } = useAuth();

    const [userDisplayName, setUserDisplayName] = useState(user.displayName);
    const [userEmail, setUserEmail] = useState(user.email);
    const [userMobile, setUserMobile] = useState(user.phoneNumber);
    const [userPhoto, setUserPhoto] = useState(user.photoUrl);
    const [userFirstName, setUserFirstName] = useState(
        user.displayName.substring(0, user.displayName.indexOf(" "))
    );
    const [userLastName, setUserLastName] = useState(
        user.displayName.substring(user.displayName.indexOf(" ") + 1)
    );
    const [userDOB, setUserDOB] = useState();
    const [userNewPassword, setUserNewPassword] = useState();
    const userUid = user.uid;
    const [authPopup, setAuthPopup] = useState(false);

    const [reAuthPassword, setReAuthPassword] = useState("");

    // user.providerData.forEach((profile) => {
    //     console.log("Sign-in provider: " + profile.providerId);
    //     console.log("  Provider-specific UID: " + profile.uid);
    //     console.log("  Name: " + profile.displayName);
    //     console.log("  Email: " + profile.email);
    //     console.log("  Photo URL: " + profile.photoURL);
    //     //console.log("  Phone Number: " + profile.phoneNumber); //not sure about this
    // });
    //update profile can only update displayName and photoUrl
    //
    ///   **********NOTE:*************
    //update email and password get an error 400 (below) to do with and should wait for the popup to close before resuming function
    //
    //https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDR90b1grij9mZjZkX_W1eEzk70pX-T1Ww 400     <--error
    const handleUpdate = () => {
        if (user.email !== userEmail) {
            setAuthPopup(true);
            console.log(authPopup);
            console.log(user.email);
            console.log(reAuthPassword);
            console.log(user);

            const credential = EmailAuthProvider.credential(
                user.email,
                reAuthPassword,
                user.providerData.tenantId
            );
            console.log(credential);
            reauthenticateWithCredential(user, credential).then(() => {
                updateEmail(user, { userEmail })
                    .then(() => {
                        alert(`Email updated to : ${userEmail}`);
                    })
                    .catch((error) => {
                        alert("something went wrong");
                    });
            });
        }
        if (user.displayName !== `${userFirstName} ${userLastName}`) {
            updateProfile(user, {
                displayName: `${userFirstName} ${userLastName}`,
                // photoURL: "https://example.com/jane-q-user/profile.jpg", //maybe make it's own function for img
            }).then(() => {alert(`Name updated to ${userFirstName} ${userLastName}`);})
            .catch(
                (error) => {
                    alert("something went wrong");
                }
            );
        }
        if (userNewPassword) {
            setAuthPopup(true);
            const credential = EmailAuthProvider.credential(
                user.email,
                reAuthPassword,
                user.providerData.tenantId
            );
            console.log(credential);
            reauthenticateWithCredential(user, credential).then(() => {
                updatePassword(user, { userNewPassword })
                    .then(() => {
                        alert("Password Updated!");
                    })
                    .catch((error) => {
                        alert("something went wrong");
                    });
            });
        }
    };
    const changeAuthPopupState = () => {
        setAuthPopup(false);
    };
    const reAuthPopup = (
        <Popup open={authPopup} onClose={changeAuthPopupState} show={true}>
            <div>
                <label>
                    this is for Reauth
                    <span className="instructions">
                        (Password must be a match)
                    </span>
                </label>
                <input
                    onChange={(event) => {
                        setReAuthPassword(event.target.value);
                    }}
                    type="password"
                    placeholder="re auth pass"
                    //defaultValue={userPassword}
                ></input>
                <button>Edit</button>
            </div>
        </Popup>
    );
    console.log(reAuthPassword);
    const userAccount = (
        <div>
            <div className="header">
                <h1>Settings</h1>
                <h4>{userDisplayName}</h4>
            </div>
            <div className="account-info">
                <h3>Account Information</h3>
                <p>Update your account information</p>
            </div>
            <div className="personal-info-editBtn-row">
                <h4>Personal Information</h4>
                {reAuthPopup}
                <button onClick={handleUpdate}>Edit</button>
            </div>
            <div className="names-row">
                <div className="first-name">
                    <label type="text">First Name</label>
                    <input
                        onChange={(event) => {
                            setUserFirstName(event.target.value);
                        }}
                        placeholder={userFirstName}
                    ></input>
                </div>
                <div className="last-name">
                    <label type="text">Last Name</label>
                    <input
                        onChange={(event) => {
                            setUserLastName(event.target.value);
                        }}
                        placeholder={userLastName}
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
                        placeholder={userMobile}
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
                    placeholder={userEmail}
                    //defaultValue={data.email}
                ></input>
            </div>
            <div className="email-row">
                <label>
                    Password
                    <span className="instructions">
                        (Password must be a match)
                    </span>
                </label>
                <input
                    onChange={(event) => {
                        setUserNewPassword(event.target.value);
                    }}
                    type="password"
                    placeholder="Password"
                    //defaultValue={data.email}
                ></input>
            </div>
            <div className="email-row">
                <label>
                    Password Confirmation
                    <span className="instructions">
                        (Password must be a match)
                    </span>
                </label>
                <input
                    onChange={(event) => {
                        setUserNewPassword(event.target.value);
                    }}
                    type="password"
                    placeholder="Password Confirmation"
                    //defaultValue={userPassword}
                ></input>
            </div>
        </div>
    );
    return <div className="settings--container">{userAccount}</div>;
};
