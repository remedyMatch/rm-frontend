import {ArtikelKategorie} from "../../../../Domain/ArtikelKategorie";
import {Grid} from "@material-ui/core";
import {uuidv4} from "./uuid";
import {CardButton} from "./CardButton";
import React from "react";
import {Artikel} from "../../../../Domain/Artikel";
import {OneToTwelve} from "../QuestionsProductDetails/QuestionsProductDetails";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Answers} from "../QuestionsStepper/QuestionsStepper";
import {chunkArray} from "./chunkArray";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        questionGrid: {
            height: 500,
            paddingTop: "100%",
            position: "relative",
        },
    }));

export const ChunkedCardsFromOptions: React.FC<{
    optionsArray: (ArtikelKategorie | Artikel)[],
    type: "ArtikelKategorie" | "Artikel",
    chunkSize: OneToTwelve,
    answers: Answers,
    setAnswers: (answers: Answers) => void,
    currentStep: number,
    setCurrentStep: (step: number) => void,
}> = ({optionsArray, type, chunkSize, answers, setAnswers, currentStep, setCurrentStep}) => {
    const classes = useStyles();

    // @ts-ignore
    const space: OneToTwelve = Math.floor(12 / chunkSize);
    const chunkedArray = chunkArray(optionsArray, chunkSize);

    return (
        <div>
            {chunkedArray.map(
                (chunk) => {
                    return <Grid key={uuidv4()} container spacing={3}>
                        {chunk.map((option) => {
                            return <Grid key={uuidv4()} className={classes.questionGrid} item
                                         xs={space}>
                                <CardButton onClick={() => {
                                    if (type === "ArtikelKategorie") {
                                        setAnswers({
                                            isDonor: answers.isDonor,
                                            category: option as ArtikelKategorie,
                                            artikel: undefined,
                                            variant: undefined,
                                            details: undefined,
                                            location: undefined,
                                        });
                                    } else if (type === "Artikel") {
                                        setAnswers({
                                            isDonor: answers.isDonor,
                                            category: answers.category,
                                            artikel: option as Artikel,
                                            variant: undefined,
                                            details: undefined,
                                            location: undefined,
                                        });
                                    }
                                    setCurrentStep(currentStep + 1)
                                }}>
                                    {option.name}
                                </CardButton>
                            </Grid>
                        })}
                    </Grid>
                }
            )}
        </div>
    )
}