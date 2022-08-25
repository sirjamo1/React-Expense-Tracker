import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Switch } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter basename="/React-Expense-Tracker">
            <Switch>
                <App />
            </Switch>
        </BrowserRouter>
    </React.StrictMode>
);
