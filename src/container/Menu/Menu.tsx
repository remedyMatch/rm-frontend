import {makeStyles, Theme} from "@material-ui/core/styles";
import {default as React} from "react";
import {Home, LocalOffer, Search} from "@material-ui/icons";
import {RouteComponentProps, withRouter} from "react-router-dom";
import MenuButton from "../../components/MenuButton";

interface Props extends RouteComponentProps {
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: "sticky",
        top: 0,
        backgroundColor: theme.palette.primary.dark,
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
                    label="Suchen"
                    icon={Search}
                    onClick={() => props.history.push("/suchen")}/>
                <MenuButton
                    label="Angebote"
                    icon={LocalOffer}
                    onClick={() => props.history.push("/angebote")}/>
            </div>
        </div>
    );
};

export default withRouter(Menu);