import React from "react";
import {ButtonBase, Card} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        questionButton: {
            width: "100%",
        },
        questionCard: {
            width: "100%",
            paddingTop: "50%",
            paddingBottom: "50%",
            position: "relative",
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
