import React from "react";
import {Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

interface Props {
}

const useStyles = makeStyles((theme: Theme) => ({}));

const HomeScreen: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div>Home</div>
    );
};

export default HomeScreen;
