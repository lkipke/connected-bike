import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './index.css';
import App from './components/App';
import { PreviousRides } from './components/PreviousRides';
import { User } from './components/User';

ReactDOM.render(
    <User>
        <Router>
            <Switch>
                <Route path='/dashboard'>
                    <PreviousRides />
                </Route>
                <Route path='/'>
                    <App />
                </Route>
            </Switch>
        </Router>
    </User>,
    document.getElementById('root')
);

navigator.serviceWorker.register('/sw.js', {
    scope: '/',
});
