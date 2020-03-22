import React from "react";
import ReactDOM from "react-dom";
import App from "./container/App/App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import {BrowserRouter as Router} from "react-router-dom";
import LoginService from "./util/LoginService";

LoginService.initKeycloak(() => ReactDOM.render((
    <Router basename="/app/">
        <App/>
    </Router>
), document.getElementById("root")));

// If you want your react-ui-common to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
