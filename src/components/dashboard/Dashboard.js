import React, { useState, useEffect } from "react";
import "./Dashboard.css";
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

export const Dashboard = () => {
    const expenseDataRef = collection(db, "expenseData");
    const [expenseData, setExpenseData] = useState([]);
    const userUid = sessionStorage.getItem("uid");

    useEffect(() => {
        const getExpenseData = async () => {
            const data = await getDocs(expenseDataRef);
            const userData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            const currentUserData = [];
            for (let i = 0; i < userData.length; i++) {
                if (userData[i].uid === userUid) {
                    currentUserData.push(userData[i].amount);
                }
            }
            setExpenseData(currentUserData);
        };
        getExpenseData();
    }, []);

    const getTotal = () => {
        let total = 0;
        const amount = expenseData;
        for (let i = 0; i < amount.length; i++) {
            let number = parseInt(amount[i]);
            total += number;
        }
        return total;
    };
    const total = getTotal();
    return <h1>Total:{total}</h1>;
};
