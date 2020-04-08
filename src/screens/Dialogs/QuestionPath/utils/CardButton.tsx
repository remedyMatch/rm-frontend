import React from "react";
import {ButtonBase, Card} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        questionButton: {
            position: "relative",
            width: "100%",
            height: "100%",
            alignItems: "strech",
        },
        questionCard: {
            position: "relative",
            height: "100%",
            width: "100%",
        },
    }));

export const CardButton: React.FC<{ onClick: () => void }> = ({children, onClick}) => {
    const classes = useStyles();
    return (
        <ButtonBase onClick={onClick} className={classes.questionButton}>
            <Card className={classes.questionCard}>
                {children}
            </Card>
        </ButtonBase>
    )
};
