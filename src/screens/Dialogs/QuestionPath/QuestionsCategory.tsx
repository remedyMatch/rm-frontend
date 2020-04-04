import {Answers} from "./Questions";
import React from "react";
import {Grid} from "@material-ui/core";

export const QuestionsCategory: React.FC<{ answers: Answers }> = ({children, answers}) => {
    return (
        <Grid container xs={12}>
            <Grid item xs={2}>

            </Grid>
            <Grid item xs={2}>

            </Grid>
            <Grid item xs={2}>

            </Grid>
            <Grid item xs={2}>

            </Grid>
            <Grid item xs={2}>

            </Grid>
            <Grid item xs={2}>

            </Grid>
        </Grid>)
};