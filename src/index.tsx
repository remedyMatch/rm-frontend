import React from "react";
import ReactDOM from "react-dom";
import App from "./container/App/App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import {BrowserRouter as Router} from "react-router-dom";
import LoginService from "./util/LoginService";
import {Provider} from "react-redux";
import {store} from "./State/Store";

LoginService.initKeycloak(() => ReactDOM.render(
    (
        <Provider store={store}>
            <Router basename={process.env.REACT_APP_BASE_PATH}>
                <App/>
            </Router>
        </Provider>
    ),
    document.getElementById("root")));

// If you want your react-ui-common to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
