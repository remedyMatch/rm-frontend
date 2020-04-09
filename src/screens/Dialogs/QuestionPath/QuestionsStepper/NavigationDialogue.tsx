import React from "react";
import {Grid, IconButton} from "@material-ui/core";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {createStyles, makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(() =>
    createStyles({
        iconButton: {
            width: 50,
            height: 400,
        }
    }),
);


export const NavigationDialogue: React.FC<{
    currentStep: number,
    setCurrentStep: (step: number) => void,
    onClickNext?: () => void, onClickBack?: () => void
}> =
    ({
         children,
         currentStep,
         setCurrentStep,
         onClickNext = () => {
             setCurrentStep(currentStep + 1)
         },
         onClickBack = () => {
             setCurrentStep(currentStep - 1)
         }
     }) => {
        const classes = useStyles();
        return (
            <Grid container spacing={3}>
                <Grid item xs={1}>
                    <IconButton className={classes.iconButton} onClick={onClickBack}>
                        <ArrowBackIosIcon/>
                    </IconButton>
                </Grid>
                <Grid item xs={10}>
                    {children}
                </Grid>
                <Grid item xs={1}>
                    <IconButton className={classes.iconButton} onClick={onClickNext}>
                        <ArrowForwardIosIcon/>
                    </IconButton>
                </Grid>
            </Grid>
        )
    };