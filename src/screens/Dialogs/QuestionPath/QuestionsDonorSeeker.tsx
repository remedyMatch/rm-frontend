import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Grid} from "@material-ui/core";
import {CardButton} from "./utils/CardButton";
import {Answers} from "./QuestionStepper";

const useStyles = makeStyles(() =>
    createStyles({
        questionGrid: {
            height: 500,
            paddingTop: "100%",
            position: "relative",
        },
    }));
export const QuestionsDonorSeeker: React.FC<{
    answers: Answers,
    setAnswers: (answers: Answers) => void,
    currentStep: number,
    setCurrentStep: (currentStep: number) => void,
}> =
    ({answers, setAnswers, currentStep, setCurrentStep}) => {
        const classes = useStyles();


        return (
            <Grid container spacing={3}>
                <Grid item xs={6} className={classes.questionGrid}>
                    <CardButton onClick={() => {
                        setAnswers({
                            isDonor: true,
                            category: answers.category,
                            exactType: answers.exactType,
                            number: answers.number,
                            location: answers.location,
                        });
                        setCurrentStep(currentStep + 1)
                    }}>
                        Anbieten
                    </CardButton>
                </Grid>

                <Grid item xs={6} className={classes.questionGrid}>
                    <CardButton onClick={() => {
                        setAnswers({
                            isDonor: false,
                            category: answers.category,
                            exactType: answers.exactType,
                            number: answers.number,
                            location: answers.location,
                        });
                        setCurrentStep(currentStep + 1)
                    }}>
                        Suchen
                    </CardButton>
                </Grid>
            </Grid>
        );
    };
