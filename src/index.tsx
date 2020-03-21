import React from "react";
import ReactDOM from "react-dom";
import App from "./container/App/App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import {HashRouter} from "react-router-dom";

ReactDOM.render(<HashRouter><App/></HashRouter>, document.getElementById("root"));

// If you want your react-ui-common to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
