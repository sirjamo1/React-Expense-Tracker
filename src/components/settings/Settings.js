import React, { useState, useEffect } from "react";
import "./Settings.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Header from "../header/Header";
import userIcon from "../icons/userIcon.png";
import transAppLogoTransparentNoText from "../images/transAppLogoTransparentNoText.png";
import {
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";
import { useAuth } from "../../Auth";
import { upload } from "../../firebase-config";

export const Settings = () => {
    const { user } = useAuth();
    console.log(user);

    const [userDisplayName, setUserDisplayName] = useState(user.displayName);
    const [userEmail, setUserEmail] = useState(user.email);
    const [userMobile, setUserMobile] = useState(user.phoneNumber);

    const [userFirstName, setUserFirstName] = useState(
        user.displayName.substring(0, user.displayName.indexOf(" "))
    );
    const [userLastName, setUserLastName] = useState(
        user.displayName.substring(user.displayName.indexOf(" ") + 1)
    );
    const [editPopupOpen, setEditPopupOpen] = useState(false);
    const [userDOB, setUserDOB] = useState();
    const [userNewPassword, setUserNewPassword] = useState("");
    const userUid = user.uid;

    const [currentPassword, setCurrentPassword] = useState("");
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photoURL, setPhotoURL] = useState(
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    );
    console.log({ photo });
    console.log(user.photoURL);
    useEffect(() => {
        if (user?.photoURL) {
            setPhotoURL(user.photoURL);
        }
    }, [user]);

    const handleUpdate = () => {
        console.log("handling update");
        if (user.email !== userEmail) {
            setEditPopupOpen(true);
            console.log(editPopupOpen + " this is email");
        }
        if (user.displayName !== `${userFirstName} ${userLastName}`) {
            updateProfile(user, {
                displayName: `${userFirstName} ${userLastName}`,
            })
                .then(() => {
                    alert(`Name updated to ${userFirstName} ${userLastName}`);
                })
                .catch((error) => {
                    alert("something went wrong");
                });
        }
        if (userNewPassword) {
            setEditPopupOpen(true);
            console.log(editPopupOpen + "password");
        }
        if (photo) {
            handleUpload();
        }
    };
    const handleUpload = () => {
        upload(photo, user, setLoading);
    };
    const handleEmailUpdate = () => {
        updateEmail(user, `${userEmail}`)
            .then(() => {
                alert(`Email updated to : ${userEmail}`);
            })
            .catch((error) => {
                alert("something went wrong");
            });
    };
    const handlePasswordUpdate = () => {
        updatePassword(user, `${userNewPassword}`)
            .then(() => {
                alert("Password Updated!");
            })
            .catch((error) => {
                alert("something went wrong");
            });
    };
    const handleAuthEdit = () => {
        const credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
        );
        reauthenticateWithCredential(user, credential)
            .then(() => {
                console.log("Auth succeeded");
                if (user.email !== userEmail && userNewPassword) {
                    handleEmailUpdate();
                    handlePasswordUpdate();
                } else if (user.email !== userEmail) {
                    handleEmailUpdate();
                } else if (userNewPassword) {
                    handlePasswordUpdate();
                }
            })
            .catch((error) => {
                console.log("auth failed");
            });
    };

    const offsetPopup = {
        right: 200,
        bottom: 20,
    };

    const reAuthPopup = (
        <Popup
            modal={true}
            offset={offsetPopup}
            show={true}
            closeOnDocumentClick={false}
            className="popup-main"
            open={editPopupOpen}
        >
            {(close) => (
                <div className="reauth-popup--container">
                    <label>Enter old password</label>
                    <input
                        onChange={(event) => {
                            setCurrentPassword(event.target.value);
                        }}
                        type="password"
                        placeholder="password"
                    ></input>
                    <button
                        className="reauth-popup-add-btn"
                        onClick={() => {
                            console.log("confirmed");
                            handleAuthEdit();
                            close();
                            setEditPopupOpen(false);
                        }}
                    >
                        Confirm
                    </button>
                    <button
                        className="reauth-popup-cancel-btn"
                        onClick={() => {
                            console.log("canceled");
                            close();
                            setEditPopupOpen(false);
                        }}
                    >
                        X
                    </button>
                </div>
            )}
        </Popup>
    );
 const handleHeaderIcon = () => {
     if (
         user.photoURL === "https://example.com/jane-q-user/profile.jpg" ||
         user.photoURL === null
     ) {
         return transAppLogoTransparentNoText;
     } else {
         return user.photoURL;
     }
 };
    const userAccount = (
        <div className="settings-info-container">
            <div className="account-info">
                <h3>Account Information</h3>
                <p>Update your account information</p>
            </div>
            <form className="info-card">
                <div className="img-row">
                    <img src={handleHeaderIcon()} alt="Avatar" className="avatar"></img>
                    <input
                        type="file"
                        className="file-input"
                        onChange={(event) => {
                            setPhoto(event.target.files[0]);
                        }}
                    ></input>
                </div>
                <div className="user-details-container">
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
                            <label>Mobile Phone</label>
                            <input
                                onChange={(event) => {
                                    setUserMobile(event.target.value);
                                }}
                                placeholder={userMobile}
                            ></input>
                        </div>
                    </div>
                    <div className="email-password-container">
                        <div className="email-password-div">
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
                            ></input>
                        </div>

                        <div className="email-password-div">
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
                            ></input>
                        </div>

                        <div className="email-password-div">
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
                            ></input>
                        </div>
                    </div>

                    {reAuthPopup}
                    <button
                    type="submit"
                        className="edit-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            handleUpdate();
                        }}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
    return (
        <div className="settings--container">
            <Header headerTitle={"Settings"} />
            {userAccount}
        </div>
    );
};
