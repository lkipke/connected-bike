import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './index.css';
import App from './components/App';
import { PreviousRides } from './components/PreviousRides';

ReactDOM.render(
    <Router>
        <Switch>
            <Route path='/dashboard'>
                <PreviousRides />
            </Route>
            <Route path='/'>
                <App />
            </Route>
        </Switch>
    </Router>,
    document.getElementById('root')
);

navigator.serviceWorker.register('/sw.js', {
    scope: '/',
});
