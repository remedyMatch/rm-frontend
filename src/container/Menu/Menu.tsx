import {makeStyles, Theme} from "@material-ui/core/styles";
import {default as React} from "react";
import {AssignmentTurnedIn, Home, HomeOutlined, LocalOffer, Lock, Search} from "@material-ui/icons";
import {RouteComponentProps, withRouter} from "react-router-dom";
import MenuButton from "../../components/Navigation/MenuButton";
import LoginService from "../../util/LoginService";

interface Props extends RouteComponentProps {
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: "sticky",
        top: 0,
        backgroundColor: theme.palette.primary.main,
        zIndex: theme.zIndex.appBar
    },
    header: {
        display: "flex",
        flexDirection: "row",
        padding: "8px 16px",
        alignItems: "center"
    }
}));

const Menu: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <MenuButton
                    label="Startseite"
                    icon={Home}
                    onClick={() => props.history.push("/")}/>
                <MenuButton
                    label="Bedarf"
                    icon={Search}
                    onClick={() => props.history.push("/bedarf")}/>
                <MenuButton
                    label="Angebote"
                    icon={LocalOffer}
                    onClick={() => props.history.push("/angebote")}/>
                <MenuButton
                    label="Aufgaben"
                    icon={AssignmentTurnedIn}
                    onClick={() => props.history.push("/aufgaben")}/>
                <MenuButton
                    label="Institution"
                    icon={HomeOutlined}
                    onClick={() => props.history.push("/institution")}/>
                <MenuButton
                    label="Logout"
                    icon={Lock}
                    onClick={async () => {
                        await LoginService.doLogout();
                        props.history.push("/");
                    }}/>
            </div>
        </div>
    );
};

export default withRouter(Menu);