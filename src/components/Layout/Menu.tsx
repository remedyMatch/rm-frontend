import {makeStyles} from "@material-ui/core/styles";
import React, {useCallback} from "react";
import {useHistory} from "react-router-dom";
import logo from "../../resources/logo.svg";
import AccountMenu from "./AccountMenu";
import NotificationMenu from "./NotificationMenu";

const useStyles = makeStyles(() => ({
    header: {
        display: "flex"
    },
    logo: {
        cursor: "pointer",
        marginLeft: "-14px",
        width: "300px",
        height: "59px"
    }
}));

const Menu: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();

    const onLogoClicked = useCallback(() => history.push("/"), [history]);

    return (
        <div className={classes.header}>
            <img
                onClick={onLogoClicked}
                title="Zum Dashboard"
                alt="RemedyMatch Logo"
                className={classes.logo}
                src={logo}/>
            <NotificationMenu/>
            <AccountMenu/>
        </div>
    );
};

export default Menu;