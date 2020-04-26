import React from "react";
import {ButtonBase, Card, Chip} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CardIcon, IconKey} from "../../../../util/CardIcon";

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

export const CardButton: React.FC<{ onClick: () => void, numberAvailable?: number, iconKey?: IconKey }> =
    ({children, onClick, numberAvailable, iconKey}) => {
        const classes = useStyles();
        return (
            <ButtonBase onClick={onClick} className={classes.questionButton}>
                <Card className={classes.questionCard}>
                    {numberAvailable ? (
                            <div>
                                <Chip label={numberAvailable}/>
                            </div>)
                        : <></>}
                    {iconKey ? (
                            <div>
                                <CardIcon iconKey={iconKey}/>
                            </div>)
                        : <></>
                    }
                    {children}
                </Card>
            </ButtonBase>
        );
    };
