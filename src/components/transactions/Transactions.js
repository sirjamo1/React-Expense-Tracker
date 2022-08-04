import React, { useState, useEffect } from "react";
import "./Transactions.css";
import { db } from "../../firebase-config";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
    query,
    orderBy,
    where,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";

export const Transactions = () => {
    const [expenseData, setExpenseData] = useState([])
    console.log(expenseData)
    const userData = []
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "expenseData"), (snapshot) => {
          setExpenseData(
              snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
          
        });


        return unsub;
    }, []);
    return <div>Transactions</div>;
};
